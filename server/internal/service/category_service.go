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

type defaultCategory struct {
	Name      string
	ColorCode string
	SortOrder int32
	IsParent  bool // 是否是父分类
}

var defaultCategories = []defaultCategory{
	// 第一类：价值产出 (Output)
	{Name: "价值产出", ColorCode: "#4CAF50", SortOrder: 1, IsParent: true},
	{Name: "核心事务", ColorCode: "#4CAF50", SortOrder: 2, IsParent: false},
	{Name: "创造/研究", ColorCode: "#8BC34A", SortOrder: 3, IsParent: false},
	{Name: "专项深耕", ColorCode: "#009688", SortOrder: 4, IsParent: false},

	// 第二类：自我提升 (Growth)
	{Name: "自我提升", ColorCode: "#2196F3", SortOrder: 5, IsParent: true},
	{Name: "广度阅读", ColorCode: "#2196F3", SortOrder: 6, IsParent: false},
	{Name: "身体管理", ColorCode: "#03A9F4", SortOrder: 7, IsParent: false},
	{Name: "技能探索", ColorCode: "#00BCD4", SortOrder: 8, IsParent: false},

	// 第三类：基础生活 (Basic)
	{Name: "基础生活", ColorCode: "#9C27B0", SortOrder: 9, IsParent: true},
	{Name: "睡眠休整", ColorCode: "#9C27B0", SortOrder: 10, IsParent: false},
	{Name: "生理代谢", ColorCode: "#673AB7", SortOrder: 11, IsParent: false},
	{Name: "物理移位", ColorCode: "#795548", SortOrder: 12, IsParent: false},

	// 第四类：能量补给 (Recharge)
	{Name: "能量补给", ColorCode: "#FF9800", SortOrder: 13, IsParent: true},
	{Name: "情感链接", ColorCode: "#FF9800", SortOrder: 14, IsParent: false},
	{Name: "深度愉悦", ColorCode: "#FF5722", SortOrder: 15, IsParent: false},

	// 第五类：系统损耗 (Drain)
	{Name: "系统损耗", ColorCode: "#F44336", SortOrder: 16, IsParent: true},
	{Name: "意志瘫痪", ColorCode: "#F44336", SortOrder: 17, IsParent: false},
	{Name: "外界干扰", ColorCode: "#E91E63", SortOrder: 18, IsParent: false},
	{Name: "未知余数", ColorCode: "#607D8B", SortOrder: 19, IsParent: false},
}

func (s *CategoryService) CreateDefaultCategories(ctx context.Context, userID int32) error {
	existing, err := s.store.ListCategoriesByUserId(ctx, userID)
	if err == nil && len(existing) > 0 {
		return nil
	}

	parentIDMap := make(map[string]int32)

	for _, dc := range defaultCategories {
		var parentID pgtype.Int4

		if dc.IsParent {
			// 父分类，不需要设置ParentID
			parentID = pgtype.Int4{Valid: false}
		} else {
			// 子分类，查找父分类的ID
			parentName := getParentCategoryName(dc.Name)
			if pid, ok := parentIDMap[parentName]; ok {
				parentID = pgtype.Int4{Int32: pid, Valid: true}
			} else {
				parentID = pgtype.Int4{Valid: false}
			}
		}

		category, err := s.store.CreateCategory(ctx, store.CreateCategoryParams{
			UserID:    userID,
			ParentID:  parentID,
			Name:      dc.Name,
			ColorCode: dc.ColorCode,
			SortOrder: dc.SortOrder,
		})
		if err != nil {
			return fmt.Errorf("create default category %s failed: %w", dc.Name, err)
		}

		// 记录父分类的ID
		if dc.IsParent {
			parentIDMap[dc.Name] = category.ID
		}
	}
	return nil
}

func getParentCategoryName(childName string) string {
	switch childName {
	case "核心事务", "创造/研究", "专项深耕":
		return "价值产出"
	case "广度阅读", "身体管理", "技能探索":
		return "自我提升"
	case "睡眠休整", "生理代谢", "物理移位":
		return "基础生活"
	case "情感链接", "深度愉悦":
		return "能量补给"
	case "意志瘫痪", "外界干扰", "未知余数":
		return "系统损耗"
	default:
		return ""
	}
}
