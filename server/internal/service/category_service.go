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

// CategoryResponse 分类响应DTO（隐藏内部ID，使用UUID）
type CategoryResponse struct {
	UUID      string `json:"uuid"`
	ParentID  *int32 `json:"parent_id,omitempty"` // 使用指针，nil时omitempty会隐藏
	Name      string `json:"name"`
	ColorCode string `json:"color_code"`
	IsActive  bool   `json:"is_active"`
	SortOrder int32  `json:"sort_order"`
	CreatedAt string `json:"created_at"`
	UpdatedAt string `json:"updated_at"`
}

// ToCategoryResponse 将数据库模型转换为响应DTO
func ToCategoryResponse(c store.Category) CategoryResponse {
	resp := CategoryResponse{
		UUID:      c.UUID.String(),
		Name:      c.Name,
		ColorCode: c.ColorCode,
		IsActive:  c.IsActive,
		SortOrder: c.SortOrder,
		CreatedAt: c.CreatedAt.Time.Format("2006-01-02T15:04:05Z"),
		UpdatedAt: c.UpdatedAt.Time.Format("2006-01-02T15:04:05Z"),
	}

	if c.ParentID.Valid {
		parentID := c.ParentID.Int32
		resp.ParentID = &parentID
	}

	return resp
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
func (s *CategoryService) CreateCategory(ctx context.Context, userUUID string, req CreateCategoryRequest) (CategoryResponse, error) {
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("get user failed")
	}
	userID := user.ID

	parentID := pgtype.Int4{Valid: false} // 默认父分类 ID 无效

	// 如果提供了父分类 UUID，则验证并获取父分类 ID
	if req.ParentUUID != nil {
		parentCategory, err := s.store.GetCategoryByUUID(ctx, *req.ParentUUID)
		if err != nil {
			return CategoryResponse{}, fmt.Errorf("parent category not found")
		}

		parentID = pgtype.Int4{Int32: parentCategory.ID, Valid: true}

		// 验证父分类是否属于当前用户
		if parentCategory.UserID != userID {
			return CategoryResponse{}, errors.New("unauthorized parent category")
		}

		// 验证父分类不能是一个子分类
		if parentCategory.ParentID.Valid {
			return CategoryResponse{}, errors.New("cannot set a subcategory as parent")
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
		return CategoryResponse{}, fmt.Errorf("create category failed: %w", err)
	}

	return ToCategoryResponse(category), nil
}

type UpdateCategoryRequest struct {
	Name        *string    `json:"name"`
	ColorCode   *string    `json:"color_code"`
	IsActive    *bool      `json:"is_active"`
	SortOrder   *int32     `json:"sort_order"`
	ParentUUID  *uuid.UUID `json:"parent_id"`       // 可选，默认为 nil（不更新）
	ClearParent *bool      `json:"clear_parent_id"` // 是否清空父分类
}

// UpdateCategory 更新分类
func (s *CategoryService) UpdateCategory(ctx context.Context, userUUID string, categoryUUID string, req UpdateCategoryRequest) (CategoryResponse, error) {
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("get user failed")
	}
	userID := user.ID

	parsedCategoryUUID, err := uuid.Parse(categoryUUID)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("invalid category UUID")
	}

	// 验证分类是否存在并属于当前用户
	existingCategory, err := s.store.GetCategoryByUUID(ctx, parsedCategoryUUID)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("category not found")
	}

	if existingCategory.UserID != userID {
		return CategoryResponse{}, errors.New("unauthorized category")
	}

	// 构建更新参数
	updateParams := store.UpdateCategoryParams{
		UUID:      parsedCategoryUUID,
		Name:      pgtype.Text{Valid: false},
		ColorCode: pgtype.Text{Valid: false},
		IsActive:  pgtype.Bool{Valid: false},
		SortOrder: pgtype.Int4{Valid: false},
		ParentID:  pgtype.Int4{Valid: false},
	}

	// 只更新提供的字段
	if req.Name != nil {
		updateParams.Name = pgtype.Text{String: *req.Name, Valid: true}
	}
	if req.ColorCode != nil {
		updateParams.ColorCode = pgtype.Text{String: *req.ColorCode, Valid: true}
	}
	if req.IsActive != nil {
		updateParams.IsActive = pgtype.Bool{Bool: *req.IsActive, Valid: true}
	}
	if req.SortOrder != nil {
		updateParams.SortOrder = pgtype.Int4{Int32: *req.SortOrder, Valid: true}
	}

	// 处理父分类更新
	if req.ClearParent != nil && *req.ClearParent {
		// 明确请求清空父分类
		updateParams.ParentID = pgtype.Int4{Valid: false}
	} else if req.ParentUUID != nil {
		// 提供了父分类 UUID，验证并设置
		parentCategory, err := s.store.GetCategoryByUUID(ctx, *req.ParentUUID)
		if err != nil {
			return CategoryResponse{}, fmt.Errorf("parent category not found")
		}

		// 验证父分类是否属于当前用户
		if parentCategory.UserID != userID {
			return CategoryResponse{}, errors.New("unauthorized parent category")
		}

		// 验证父分类不能是一个子分类（只能有两层：父分类 -> 子分类）
		if parentCategory.ParentID.Valid {
			return CategoryResponse{}, errors.New("cannot set a subcategory as parent")
		}

		// 验证不能将分类设置为自己为父分类
		if parentCategory.UUID == parsedCategoryUUID {
			return CategoryResponse{}, errors.New("cannot set self as parent")
		}

		updateParams.ParentID = pgtype.Int4{Int32: parentCategory.ID, Valid: true}
	}

	updatedCategory, err := s.store.UpdateCategory(ctx, updateParams)
	if err != nil {
		return CategoryResponse{}, fmt.Errorf("update category failed: %w", err)
	}

	return ToCategoryResponse(updatedCategory), nil
}

// DeleteCategory 删除分类（软删除）
func (s *CategoryService) DeleteCategory(ctx context.Context, userUUID string, categoryUUID string) error {
	parsedUUID, err := uuid.Parse(userUUID)
	if err != nil {
		return fmt.Errorf("invalid user UUID")
	}
	user, err := s.store.GetUserByUUID(ctx, parsedUUID)
	if err != nil {
		return fmt.Errorf("get user failed")
	}
	userID := user.ID

	parsedCategoryUUID, err := uuid.Parse(categoryUUID)
	if err != nil {
		return fmt.Errorf("invalid category UUID")
	}

	// 验证分类是否存在并属于当前用户
	existingCategory, err := s.store.GetCategoryByUUID(ctx, parsedCategoryUUID)
	if err != nil {
		return fmt.Errorf("category not found")
	}

	if existingCategory.UserID != userID {
		return errors.New("unauthorized category")
	}

	// 检查是否有子分类
	subCategoryCount, err := s.store.CountSubCategories(ctx, store.CountSubCategoriesParams{
		ParentID: pgtype.Int4{Int32: existingCategory.ID, Valid: true},
		UserID:   userID,
	})
	if err != nil {
		return fmt.Errorf("check sub categories failed")
	}

	if subCategoryCount > 0 {
		return fmt.Errorf("cannot delete category with subcategories")
	}

	// 执行软删除
	err = s.store.DeleteCategory(ctx, parsedCategoryUUID)
	if err != nil {
		return fmt.Errorf("delete category failed: %w", err)
	}

	return nil
}
