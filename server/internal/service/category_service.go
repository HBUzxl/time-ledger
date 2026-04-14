package service

import (
	"context"
	"errors"
	"fmt"
	"time-ledger/internal/db/store"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgtype"
)

type CategoryService struct {
	store *store.Queries
}

func NewCategoryService(store *store.Queries) *CategoryService {
	return &CategoryService{store: store}
}

type CreateCategoryRequest struct {
	ParentUUID *uuid.UUID `json:"parent_id"` // 可选，默认为 nil
	Name       string     `json:"name" binding:"required"`
	ColorCode  string     `json:"color_code" binding:"required"`
	SortOrder  int32      `json:"sort_order" binding:"required"`
}

// ListCategoriesByUserID 根据用户 ID 获取分类列表
func (s *CategoryService) ListCategoriesByUserID(ctx context.Context, userID int32) ([]store.Category, error) {
	categories, err := s.store.ListCategoriesByUserId(ctx, userID)
	if err != nil {
		return nil, err
	}
	// Return empty slice instead of nil for consistent JSON serialization
	if categories == nil {
		return []store.Category{}, nil
	}
	return categories, nil
}

// ListCategoriesByUserUUID 根据用户 UUID 获取分类列表
func (s *CategoryService) ListCategoriesByUserUUID(ctx context.Context, userUUID string) ([]store.Category, error) {
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return nil, fmt.Errorf("get user failed")
	}

	return s.ListCategoriesByUserID(ctx, user.ID)
}

// CreateCategory 创建分类
func (s *CategoryService) CreateCategory(ctx context.Context, userUUID string, req CreateCategoryRequest) (*store.Category, error) {
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return nil, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return nil, fmt.Errorf("get user failed")
	}
	userID := user.ID

	parentID := pgtype.Int4{Valid: false} // 默认父分类 ID 无效

	// 如果提供了父分类 UUID，则验证并获取父分类 ID
	if req.ParentUUID != nil {
		parentCategory, err := s.store.GetCategoryByUUID(ctx, *req.ParentUUID)
		if err != nil {
			return nil, fmt.Errorf("parent category not found")
		}

		parentID = pgtype.Int4{Int32: parentCategory.ID, Valid: true}

		// 验证父分类是否属于当前用户
		if parentCategory.UserID != userID {
			return nil, errors.New("unauthorized parent category")
		}

		// 验证父分类不能是一个子分类
		if parentCategory.ParentID.Valid {
			return nil, errors.New("cannot set a subcategory as parent")
		}
	}

	category, err := s.store.CreateCategory(ctx, store.CreateCategoryParams{
		UserID:    userID,
		ParentID:  parentID,
		Name:      req.Name,
		ColorCode: req.ColorCode,
		SortOrder: req.SortOrder,
	})
	if err != nil {
		return nil, fmt.Errorf("create category failed: %w", err)
	}

	return &category, nil
}
