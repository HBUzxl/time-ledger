package service

import (
	"context"
	"time-ledger/internal/db/store"
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
