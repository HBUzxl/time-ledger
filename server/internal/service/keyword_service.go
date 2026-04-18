package service

import (
	"context"
	"errors"
	"fmt"
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
