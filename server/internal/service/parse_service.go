package service

import (
	"context"
	"regexp"
	"strings"
	"time"

	"time-ledger/internal/db/store"

	"github.com/google/uuid"
)

type ParseRequest struct {
	RawText       string `json:"raw_text" binding:"required"`
	Timezone      string `json:"timezone" binding:"required"`
	ReferenceDate string `json:"reference_date"`
}

type CategoryInfo struct {
	UUID       string `json:"uuid"`
	Name       string `json:"name"`
	ParentUUID string `json:"parent_uuid,omitempty"`
	ParentName string `json:"parent_name,omitempty"`
}

type ParseResponseData struct {
	StartTime       string        `json:"start_time"`
	EndTime         string        `json:"end_time"`
	DurationMinutes int           `json:"duration_minutes"`
	Note            string        `json:"note"`
	MatchedCategory *CategoryInfo `json:"matched_category"`
	Confidence      float64       `json:"confidence"`
	Warnings        []string      `json:"warnings"`
}

type ParseResponse struct {
	Success bool              `json:"success"`
	Data    ParseResponseData `json:"data"`
	RawText string            `json:"raw_text"`
}

type ParseService struct {
	store      *store.Queries
	keywordSvc *KeywordService
}

func NewParseService(store *store.Queries, keywordSvc *KeywordService) *ParseService {
	return &ParseService{store: store, keywordSvc: keywordSvc}
}

// Parse 解析文本，提取时间、时长、备注等信息，并尝试匹配用户分类
// 输入示例: "10:00-11:30 读书 《1984》", timezone: "Asia/Shanghai", reference_date: "2026-04-16"
func (s *ParseService) Parse(ctx context.Context, userUUID string, req ParseRequest) (ParseResponse, error) {
	// 1. 根据用户UUID获取用户信息（用于后续权限验证和分类查询）
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return ParseResponse{}, err
	}

	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return ParseResponse{}, err
	}

	// 2. 解析参考日期，默认使用今天
	referenceDate := time.Now()
	if req.ReferenceDate != "" {
		referenceDate, err = time.Parse("2006-01-02", req.ReferenceDate)
		if err != nil {
			referenceDate = time.Now()
		}
	}

	// 3. 提取时间范围 (支持格式: 10:00-11:30 或 10:00 - 11:30)
	timePattern := regexp.MustCompile(`(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})`)
	matches := timePattern.FindStringSubmatch(req.RawText)

	// 4. 无法解析时间时返回失败
	if len(matches) == 0 {
		return ParseResponse{
			Success: false,
			Data: ParseResponseData{
				Warnings: []string{"未能解析时间"},
			},
			RawText: req.RawText,
		}, nil
	}

	// 5. 解析开始和结束时间
	startHour := parseInt(matches[1])
	startMin := parseInt(matches[2])
	endHour := parseInt(matches[3])
	endMin := parseInt(matches[4])

	// 6. 根据timezone解析时区
	loc, _ := time.LoadLocation(req.Timezone)
	if loc == nil {
		loc = time.UTC
	}

	// 7. 构建具体的日期时间
	startTime := time.Date(referenceDate.Year(), referenceDate.Month(), referenceDate.Day(), startHour, startMin, 0, 0, loc)
	endTime := time.Date(referenceDate.Year(), referenceDate.Month(), referenceDate.Day(), endHour, endMin, 0, 0, loc)

	// 8. 如果结束时间早于开始时间，视为跨天 (如 23:00-01:00)
	if endTime.Before(startTime) {
		endTime = endTime.Add(24 * time.Hour)
	}

	// 9. 计算时长(分钟)
	durationMinutes := int(endTime.Sub(startTime).Minutes())

	// 10. 提取时间后面的备注内容
	rawTextAfterTime := timePattern.ReplaceAllString(req.RawText, "")
	note := extractNote(rawTextAfterTime)

	// 11. 尝试匹配用户分类 (优先关键词匹配，其次名称匹配)
	matchedCategory := s.matchCategoryByKeywordOrName(ctx, userUUID, user.ID, note)

	// 12. 匹配到分类时置信度较高，否则使用默认置信度
	var confidence float64 = 0.5
	if matchedCategory != nil {
		confidence = 0.95
	}

	// 13. 生成警告信息
	var warnings []string
	if durationMinutes > 480 {
		warnings = append(warnings, "时长超过8小时")
	}
	if durationMinutes <= 0 {
		warnings = append(warnings, "结束时间应晚于开始时间")
	}

	return ParseResponse{
		Success: true,
		Data: ParseResponseData{
			StartTime:       startTime.UTC().Format("2006-01-02T15:04:05Z"),
			EndTime:         endTime.UTC().Format("2006-01-02T15:04:05Z"),
			DurationMinutes: durationMinutes,
			Note:            note,
			MatchedCategory: matchedCategory,
			Confidence:      confidence,
			Warnings:        warnings,
		},
		RawText: req.RawText,
	}, nil
}

// parseInt 将字符串解析为整数 (简单实现)
func parseInt(s string) int {
	var n int
	for _, c := range s {
		if c >= '0' && c <= '9' {
			n = n*10 + int(c-'0')
		}
	}
	return n
}

// extractNote 从文本中提取备注 (提取时间后面第一个连续的中文/英文/数字字符串)
func extractNote(s string) string {
	s = strings.TrimSpace(s)
	re := regexp.MustCompile(`^[\p{Han}a-zA-Z0-9]+`)
	matches := re.FindStringSubmatch(s)
	if len(matches) > 0 {
		return matches[0]
	}
	return ""
}

// contains 检查字符串s是否包含子串sub
func contains(s, sub string) bool {
	for i := 0; i <= len(s)-len(sub); i++ {
		if s[i:i+len(sub)] == sub {
			return true
		}
	}
	return false
}

// buildCategoryInfo 构建分类信息，包含父分类名称
func (s *ParseService) buildCategoryInfo(ctx context.Context, c store.Category) *CategoryInfo {
	info := &CategoryInfo{
		UUID: c.UUID.String(),
		Name: c.Name,
	}

	if c.ParentID.Valid {
		parent, err := s.store.GetCategoryByID(ctx, c.ParentID.Int32)
		if err == nil {
			info.ParentUUID = parent.UUID.String()
			info.ParentName = parent.Name
		}
	}

	return info
}

// matchCategoryByKeywordOrName 优先关键词匹配，其次名称匹配
// userID 在 Parse 方法中已查询，直接传入避免重复查询
func (s *ParseService) matchCategoryByKeywordOrName(ctx context.Context, userUUID string, userID int32, note string) *CategoryInfo {
	if note == "" {
		return nil
	}

	// 第1步：关键词匹配
	if s.keywordSvc != nil {
		categories, err := s.keywordSvc.SearchKeywordInUser(ctx, userUUID, note)
		if err == nil && len(categories) > 0 {
			return s.buildCategoryInfo(ctx, categories[0])
		}
	}

	// 第2步：名称匹配（原有逻辑）
	categories, err := s.store.ListCategoriesByUserId(ctx, userID)
	if err != nil {
		return nil
	}

	for _, c := range categories {
		if c.Name == note {
			return s.buildCategoryInfo(ctx, c)
		}
	}

	for _, c := range categories {
		if len(c.Name) >= 2 && len(note) >= 2 && (contains(c.Name, note) || contains(note, c.Name)) {
			return s.buildCategoryInfo(ctx, c)
		}
	}

	return nil
}
