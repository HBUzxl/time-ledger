package service

import (
	"context"
	"errors"
	"fmt"
	"log"
	"time-ledger/internal/db/store"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type KeywordService struct {
	store *store.Queries
}

func NewKeywordService(store *store.Queries) *KeywordService {
	return &KeywordService{store: store}
}

type KeywordResponse struct {
	UUID         string `json:"uuid"`
	CategoryUUID string `json:"category_uuid"`
	Keyword      string `json:"keyword"`
	KeywordType  string `json:"keyword_type"`
	CreatedAt    string `json:"created_at"`
}

func toKeywordResponse(kw store.CategoryKeyword, categoryUUID string) KeywordResponse {
	return KeywordResponse{
		UUID:         kw.UUID.String(),
		CategoryUUID: categoryUUID,
		Keyword:      kw.Keyword,
		KeywordType:  kw.KeywordType.String,
		CreatedAt:    kw.CreatedAt.Time.Format("2006-01-02T15:04:05Z"),
	}
}

type CreateKeywordRequest struct {
	Keyword     string `json:"keyword" binding:"required"`
	KeywordType string `json:"keyword_type"`
}

func (s *KeywordService) CreateKeyword(ctx context.Context, userUUID string, categoryUUID string, req CreateKeywordRequest) (KeywordResponse, error) {
	parsedUserUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return KeywordResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUserUUID)
	if err != nil {
		return KeywordResponse{}, fmt.Errorf("get user failed")
	}

	parsedCategoryUUID, err := uuid.Parse(categoryUUID)
	if err != nil {
		return KeywordResponse{}, fmt.Errorf("invalid category UUID")
	}

	category, err := s.store.GetCategoryByUUID(ctx, parsedCategoryUUID)
	if err != nil {
		return KeywordResponse{}, fmt.Errorf("category not found")
	}

	if category.UserID != user.ID {
		return KeywordResponse{}, errors.New("unauthorized category")
	}

	keywordType := "user"
	if req.KeywordType != "" {
		keywordType = req.KeywordType
	}

	kw, err := s.store.CreateKeyword(ctx, store.CreateKeywordParams{
		CategoryID:  category.ID,
		Lower:       req.Keyword,
		KeywordType: pgtype.Text{String: keywordType, Valid: true},
	})
	if err != nil {
		return KeywordResponse{}, fmt.Errorf("create keyword failed: %w", err)
	}

	return toKeywordResponse(kw, categoryUUID), nil
}

func (s *KeywordService) ListKeywordsByCategory(ctx context.Context, userUUID string, categoryUUID string) ([]KeywordResponse, error) {
	parsedUserUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUserUUID)
	if err != nil {
		return nil, fmt.Errorf("get user failed")
	}

	parsedCategoryUUID, err := uuid.Parse(categoryUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid category UUID")
	}

	category, err := s.store.GetCategoryByUUID(ctx, parsedCategoryUUID)
	if err != nil {
		return nil, fmt.Errorf("category not found")
	}

	if category.UserID != user.ID {
		return nil, errors.New("unauthorized category")
	}

	keywords, err := s.store.ListKeywordsByCategoryID(ctx, category.ID)
	if err != nil {
		return nil, fmt.Errorf("list keywords failed")
	}

	resp := make([]KeywordResponse, len(keywords))
	for i, kw := range keywords {
		resp[i] = toKeywordResponse(kw, categoryUUID)
	}

	return resp, nil
}

func (s *KeywordService) SearchKeywordInUser(ctx context.Context, userUUID string, keyword string) ([]store.Category, error) {
	parsedUserUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUserUUID)
	if err != nil {
		return nil, fmt.Errorf("get user failed")
	}

	keywords, err := s.store.SearchKeyword(ctx, store.SearchKeywordParams{
		Lower:  keyword,
		UserID: user.ID,
	})
	if err != nil || len(keywords) == 0 {
		return nil, nil
	}

	categoryIDs := make([]int32, len(keywords))
	for i, kw := range keywords {
		categoryIDs[i] = kw.CategoryID
	}

	// 批量查询，一次 DB 调用
	categories, err := s.store.GetCategoriesByIDs(ctx, categoryIDs)
	if err != nil {
		return nil, fmt.Errorf("get categories failed: %w", err)
	}

	return categories, nil
}

type defaultKeyword struct {
	Keyword    string
	CategoryID int32
}

func (s *KeywordService) CreateDefaultKeywords(ctx context.Context, userID int32) error {
	categories, err := s.store.ListCategoriesByUserId(ctx, userID)
	if err != nil || len(categories) == 0 {
		return nil
	}

	categoryByName := make(map[string]int32)
	for _, c := range categories {
		categoryByName[c.Name] = c.ID
	}

	defaultKeywords := []defaultKeyword{
		// 价值产出
		{Keyword: "工作", CategoryID: categoryByName["核心事务"]},
		{Keyword: "上班", CategoryID: categoryByName["核心事务"]},
		{Keyword: "开会", CategoryID: categoryByName["核心事务"]},
		{Keyword: "写代码", CategoryID: categoryByName["创造/研究"]},
		{Keyword: "写文章", CategoryID: categoryByName["创造/研究"]},
		{Keyword: "读书", CategoryID: categoryByName["专项深耕"]},
		{Keyword: "学习", CategoryID: categoryByName["专项深耕"]},

		// 自我提升
		{Keyword: "看书", CategoryID: categoryByName["广度阅读"]},
		{Keyword: "健身", CategoryID: categoryByName["身体管理"]},
		{Keyword: "运动", CategoryID: categoryByName["身体管理"]},
		{Keyword: "跑步", CategoryID: categoryByName["身体管理"]},
		{Keyword: "冥想", CategoryID: categoryByName["身体管理"]},

		// 基础生活
		{Keyword: "睡觉", CategoryID: categoryByName["睡眠休整"]},
		{Keyword: "午休", CategoryID: categoryByName["睡眠休整"]},
		{Keyword: "休息", CategoryID: categoryByName["睡眠休整"]},
		{Keyword: "吃饭", CategoryID: categoryByName["生理代谢"]},
		{Keyword: "做饭", CategoryID: categoryByName["生理代谢"]},
		{Keyword: "通勤", CategoryID: categoryByName["物理移位"]},
		{Keyword: "打车", CategoryID: categoryByName["物理移位"]},

		// 能量补给
		{Keyword: "聊天", CategoryID: categoryByName["情感链接"]},
		{Keyword: "聚会", CategoryID: categoryByName["情感链接"]},
		{Keyword: "看剧", CategoryID: categoryByName["深度愉悦"]},
		{Keyword: "看电影", CategoryID: categoryByName["深度愉悦"]},
		{Keyword: "聚餐", CategoryID: categoryByName["深度愉悦"]},

		// 系统损耗
		{Keyword: "刷短视频", CategoryID: categoryByName["意志瘫痪"]},
		{Keyword: "刷抖音", CategoryID: categoryByName["意志瘫痪"]},
		{Keyword: "发呆", CategoryID: categoryByName["意志瘫痪"]},
	}

	for _, dk := range defaultKeywords {
		if dk.CategoryID == 0 {
			continue
		}
		_, err := s.store.CreateKeyword(ctx, store.CreateKeywordParams{
			CategoryID:  dk.CategoryID,
			Lower:       dk.Keyword,
			KeywordType: pgtype.Text{String: "system", Valid: true},
		})
		if err != nil {
			log.Printf("create default keyword %s failed: %v", dk.Keyword, err)
			continue
		}
	}
	return nil
}
