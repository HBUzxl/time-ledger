package service

import (
	"context"
	"fmt"
	"time"
	"time-ledger/internal/db/store"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

const SystemPublicUserID = 0

// RecordResponse 时间记录响应DTO（隐藏内部ID，使用UUID）
type RecordResponse struct {
	UUID            uuid.UUID `json:"uuid"`
	CategoryUUID    uuid.UUID `json:"category_uuid"`
	StartTime       time.Time `json:"start_time"`
	EndTime         time.Time `json:"end_time"`
	DurationMinutes int32     `json:"duration_minutes"`
	Note            string    `json:"note,omitempty"`
	Source          string    `json:"source"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type ListRecordsRequest struct {
	StartDate string `form:"start_date" binding:"required"`
	EndDate   string `form:"end_date" binding:"required"`
	Page      int    `form:"page"`
	PageSize  int    `form:"page_size"`
}

type ListRecordsResponse struct {
	Records   []RecordResponse `json:"records"`
	Page      int              `json:"page"`
	PageSize  int              `json:"page_size"`
	Total     int64            `json:"total"`
	TotalPage int64            `json:"total_page"`
}

// ToRecordResponse 将数据库模型转换为响应DTO
func ToRecordResponse(record *store.TimeRecord, categoryUUID uuid.UUID) RecordResponse {
	note := ""
	if record.Note.Valid {
		note = record.Note.String
	}
	return RecordResponse{
		UUID:            record.UUID,
		CategoryUUID:    categoryUUID,
		StartTime:       record.StartTime.Time,
		EndTime:         record.EndTime.Time,
		DurationMinutes: record.DurationMinutes,
		Note:            note,
		Source:          record.Source,
		CreatedAt:       record.CreatedAt.Time,
		UpdatedAt:       record.UpdatedAt.Time,
	}
}

type RecordService struct {
	store *store.Queries
}

func NewRecordService(store *store.Queries) *RecordService {
	return &RecordService{store: store}
}

type CreateRecordRequest struct {
	CategoryUUID string    `json:"category_uuid" binding:"required"`
	StartTime    time.Time `json:"start_time" binding:"required"`
	EndTime      time.Time `json:"end_time" binding:"required,gtfield=StartTime"`
	Note         string    `json:"note"`
	Source       string    `json:"source"` // 默认为 "manual"
}

type CreateRecordResponse struct {
	Record  RecordResponse `json:"record"`
	Warning string         `json:"warning,omitempty"`
}

type UpdateRecordRequest struct {
	CategoryUUID string    `json:"category_uuid" binding:"required"`
	StartTime    time.Time `json:"start_time" binding:"required"`
	EndTime      time.Time `json:"end_time" binding:"required,gtfield=StartTime"`
	Note         string    `json:"note"`
}

type UpdateRecordResponse struct {
	Record  RecordResponse `json:"record"`
	Warning string         `json:"warning,omitempty"`
}

// CreateRecord 创建新的时间记录
func (s *RecordService) CreateRecord(ctx context.Context, userUUID string, req CreateRecordRequest) (CreateRecordResponse, error) {
	// 0. 根据用户 UUID 获取用户 ID
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return CreateRecordResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return CreateRecordResponse{}, fmt.Errorf("get user failed")
	}
	userID := user.ID

	// 1. 根据 category_uuid 获取分类
	categoryUUID, err := uuid.Parse(req.CategoryUUID)
	if err != nil {
		return CreateRecordResponse{}, fmt.Errorf("invalid category UUID")
	}
	category, err := s.store.GetCategoryByUUID(ctx, categoryUUID)
	if err != nil {
		return CreateRecordResponse{}, fmt.Errorf("invalid category: %w", err)
	}

	// 只有自己的分类或者系统公共分类可以使用
	isOwner := category.UserID == userID
	isPublic := category.UserID == SystemPublicUserID
	if !isOwner && !isPublic {
		return CreateRecordResponse{}, fmt.Errorf("category does not belong to user")
	}

	// 2. 计算持续时间（分钟）
	duration := int32(req.EndTime.Sub(req.StartTime).Minutes())
	if duration <= 0 {
		return CreateRecordResponse{}, fmt.Errorf("end time must be after start time")
	}

	// 3. 检查时间冲突
	startTime := pgtype.Timestamptz{Time: req.StartTime, Valid: true}
	endTime := pgtype.Timestamptz{Time: req.EndTime, Valid: true}

	hasOverlap, err := s.store.CheckOverlap(ctx, store.CheckOverlapParams{
		UserID:     userID,
		Overlaps:   startTime,
		Overlaps_2: endTime,
	})
	if err != nil {
		return CreateRecordResponse{}, fmt.Errorf("failed to check overlap: %w", err)
	}

	var warning string
	if hasOverlap {
		warning = "time_conflict"
		return CreateRecordResponse{
			Record:  RecordResponse{}, // 不返回记录数据
			Warning: warning,
		}, nil
	}

	source := req.Source
	if source == "" {
		source = "manual"
	}
	categoryID := pgtype.Int4{Int32: category.ID, Valid: true}
	note := pgtype.Text{String: req.Note, Valid: req.Note != ""}

	// 4. 创建记录
	record, err := s.store.CreateRecord(ctx, store.CreateRecordParams{
		UserID:          userID,
		CategoryID:      categoryID,
		StartTime:       startTime,
		EndTime:         endTime,
		DurationMinutes: duration,
		Note:            note,
		Source:          source,
	})
	if err != nil {
		return CreateRecordResponse{}, fmt.Errorf("failed to create record: %w", err)
	}

	// 5. 转换为响应DTO
	return CreateRecordResponse{
		Record:  ToRecordResponse(&record, category.UUID),
		Warning: warning,
	}, nil
}

// ListRecords 列出用户在指定日期范围内的时间记录，支持分页
func (s *RecordService) ListRecords(ctx context.Context, userUUID string, req ListRecordsRequest) (ListRecordsResponse, error) {
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return ListRecordsResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return ListRecordsResponse{}, fmt.Errorf("get user failed")
	}
	userID := user.ID

	startDate, err := time.Parse("2006-01-02", req.StartDate)
	if err != nil {
		return ListRecordsResponse{}, fmt.Errorf("invalid start_date format")
	}
	endDate, err := time.Parse("2006-01-02", req.EndDate)
	if err != nil {
		return ListRecordsResponse{}, fmt.Errorf("invalid end_date format")
	}
	// 包含结束日期的全天
	endDate = endDate.AddDate(0, 0, 1)

	page := req.Page
	if page < 1 {
		page = 1
	}
	pageSize := req.PageSize
	if pageSize < 1 || pageSize > 100 {
		pageSize = 20
	}
	offset := int32((page - 1) * pageSize)

	startTime := pgtype.Timestamptz{Time: startDate, Valid: true}
	endTime := pgtype.Timestamptz{Time: endDate, Valid: true}

	records, err := s.store.GetRecords(ctx, store.GetRecordsParams{
		UserID:      userID,
		StartTime:   startTime,
		StartTime_2: endTime,
		Limit:       int32(pageSize),
		Offset:      offset,
	})
	if err != nil {
		return ListRecordsResponse{}, fmt.Errorf("failed to get records: %w", err)
	}

	total, err := s.store.CountRecords(ctx, store.CountRecordsParams{
		UserID:      userID,
		StartTime:   startTime,
		StartTime_2: endTime,
	})
	if err != nil {
		return ListRecordsResponse{}, fmt.Errorf("failed to count records: %w", err)
	}

	var recordResponses []RecordResponse
	for _, r := range records {
		categoryUUID := uuid.Nil
		if r.CategoryUuid.Valid {
			u, _ := r.CategoryUuid.UUIDValue()
			categoryUUID = u.Bytes
		}
		recordResponses = append(recordResponses, ToRecordResponse(&store.TimeRecord{
			ID:              r.ID,
			UUID:            r.UUID,
			UserID:          r.UserID,
			CategoryID:      r.CategoryID,
			StartTime:       r.StartTime,
			EndTime:         r.EndTime,
			DurationMinutes: r.DurationMinutes,
			Note:            r.Note,
			Source:          r.Source,
			CreatedAt:       r.CreatedAt,
			UpdatedAt:       r.UpdatedAt,
		}, categoryUUID))
	}

	totalPage := (total + int64(pageSize) - 1) / int64(pageSize)

	return ListRecordsResponse{
		Records:   recordResponses,
		Page:      page,
		PageSize:  pageSize,
		Total:     total,
		TotalPage: totalPage,
	}, nil
}

func (s *RecordService) UpdateRecord(ctx context.Context, userUUID string, recordUUID string, req UpdateRecordRequest) (UpdateRecordResponse, error) {
	parsedUserUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUserUUID)
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("get user failed")
	}
	userID := user.ID

	parsedRecordUUID, err := uuid.Parse(recordUUID)
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("invalid record UUID")
	}

	existingRecord, err := s.store.GetRecordByUUID(ctx, store.GetRecordByUUIDParams{
		UUID:   parsedRecordUUID,
		UserID: userID,
	})
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("record not found")
	}

	categoryUUID, err := uuid.Parse(req.CategoryUUID)
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("invalid category UUID")
	}
	category, err := s.store.GetCategoryByUUID(ctx, categoryUUID)
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("invalid category: %w", err)
	}

	isOwner := category.UserID == userID
	isPublic := category.UserID == SystemPublicUserID
	if !isOwner && !isPublic {
		return UpdateRecordResponse{}, fmt.Errorf("category does not belong to user")
	}

	duration := int32(req.EndTime.Sub(req.StartTime).Minutes())
	if duration <= 0 {
		return UpdateRecordResponse{}, fmt.Errorf("end time must be after start time")
	}

	startTime := pgtype.Timestamptz{Time: req.StartTime, Valid: true}
	endTime := pgtype.Timestamptz{Time: req.EndTime, Valid: true}

	hasOverlap, err := s.store.CheckOverlap(ctx, store.CheckOverlapParams{
		UserID:     userID,
		Overlaps:   startTime,
		Overlaps_2: endTime,
	})
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("failed to check overlap: %w", err)
	}

	var warning string
	if hasOverlap {
		warning = "time_conflict"
		return UpdateRecordResponse{
			Record:  RecordResponse{}, // 不返回记录数据
			Warning: warning,
		}, nil
	}

	categoryID := pgtype.Int4{Int32: category.ID, Valid: true}
	note := pgtype.Text{String: req.Note, Valid: req.Note != ""}

	record, err := s.store.UpdateRecord(ctx, store.UpdateRecordParams{
		UUID:            parsedRecordUUID,
		CategoryID:      categoryID,
		StartTime:       startTime,
		EndTime:         endTime,
		DurationMinutes: duration,
		Note:            note,
		UserID:          userID,
	})
	if err != nil {
		return UpdateRecordResponse{}, fmt.Errorf("failed to update record: %w", err)
	}

	var originalCategoryUUID uuid.UUID
	if existingRecord.CategoryUuid.Valid {
		u, _ := existingRecord.CategoryUuid.UUIDValue()
		originalCategoryUUID = u.Bytes
	}

	return UpdateRecordResponse{
		Record:  ToRecordResponse(&record, originalCategoryUUID),
		Warning: warning,
	}, nil
}

func (s *RecordService) DeleteRecord(ctx context.Context, userUUID string, recordUUID string) error {
	parsedUserUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUserUUID)
	if err != nil {
		return fmt.Errorf("get user failed")
	}
	userID := user.ID

	parsedRecordUUID, err := uuid.Parse(recordUUID)
	if err != nil {
		return fmt.Errorf("invalid record UUID")
	}

	_, err = s.store.GetRecordByUUID(ctx, store.GetRecordByUUIDParams{
		UUID:   parsedRecordUUID,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("record not found")
	}

	_, err = s.store.DeleteRecord(ctx, store.DeleteRecordParams{
		UUID:   parsedRecordUUID,
		UserID: userID,
	})
	if err != nil {
		return fmt.Errorf("failed to delete record: %w", err)
	}

	return nil
}
