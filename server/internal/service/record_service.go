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
	CategoryID int32     `json:"category_id" binding:"required"`
	StartTime  time.Time `json:"start_time" binding:"required"`
	EndTime    time.Time `json:"end_time" binding:"required,gtfield=StartTime"`
	Note       string    `json:"note"`
	Source     string    `json:"source"` // 默认为 "manual"
}

// CreateRecord 创建新的时间记录
func (s *RecordService) CreateRecord(ctx context.Context, userUUID string, req CreateRecordRequest) (RecordResponse, error) {
	// 0. 根据用户 UUID 获取用户 ID
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return RecordResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return RecordResponse{}, fmt.Errorf("get user failed")
	}
	userID := user.ID

	// 1. 验证分类是否存在且属于该用户
	category, err := s.store.GetCategoryByID(ctx, req.CategoryID)
	if err != nil {
		return RecordResponse{}, fmt.Errorf("invalid category: %w", err)
	}

	// 只有自己的分类或者系统公共分类可以使用
	isOwner := category.UserID == userID
	isPublic := category.UserID == SystemPublicUserID
	if !isOwner && !isPublic {
		return RecordResponse{}, fmt.Errorf("category does not belong to user")
	}

	// 2. 计算持续时间（分钟）
	duration := int32(req.EndTime.Sub(req.StartTime).Minutes())
	if duration <= 0 {
		return RecordResponse{}, fmt.Errorf("end time must be after start time")
	}

	source := req.Source
	if source == "" {
		source = "manual"
	}
	categoryID := pgtype.Int4{Int32: req.CategoryID, Valid: true}
	startTime := pgtype.Timestamptz{Time: req.StartTime, Valid: true}
	endTime := pgtype.Timestamptz{Time: req.EndTime, Valid: true}
	note := pgtype.Text{String: req.Note, Valid: req.Note != ""}

	// 3. 创建记录
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
		return RecordResponse{}, fmt.Errorf("failed to create record: %w", err)
	}

	// 4. 转换为响应DTO
	return ToRecordResponse(&record, category.UUID), nil
}
