package service

import (
	"context"
	"fmt"
	"time-ledger/internal/db/store"

	"github.com/google/uuid"
)

type CategoryService struct {
	store *store.Queries
}

func NewCategoryService(store *store.Queries) *CategoryService {
	return &CategoryService{store: store}
}

// ListCategoriesByUserID retrieves all active categories for a given user
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
