package handler

import (
	"net/http"
	"time-ledger/internal/db/store"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

// categoryResponse excludes ID and UserID from the response
type categoryResponse struct {
	UUID      string `json:"uuid"`
	ParentID  any    `json:"parent_id,omitempty"`
	Name      string `json:"name"`
	ColorCode string `json:"color_code"`
	IsActive  bool   `json:"is_active"`
	SortOrder int32  `json:"sort_order"`
	CreatedAt any    `json:"created_at"`
	UpdatedAt any    `json:"updated_at"`
}

// ListCategories handles
// GET /api/v1/categories
func (h *CategoryHandler) ListCategories(ctx *gin.Context) {
	userUUID, exists := ctx.Get("user_uuid")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not authenticated",
		})
		return
	}

	categories, err := h.service.ListCategoriesByUserUUID(ctx.Request.Context(), userUUID.(string))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to fetch categories",
		})
		return
	}

	respCategories := make([]categoryResponse, len(categories))
	for i, c := range categories {
		respCategories[i] = toCategoryResponse(c)
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": respCategories,
	})
}

// CreateCategory 创建分类
// POST /api/v1/categories
func (h *CategoryHandler) CreateCategory(ctx *gin.Context) {
	var req service.CreateCategoryRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	userUUID, exists := ctx.Get("user_uuid")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not authenticated",
		})
		return
	}

	category, err := h.service.CreateCategory(ctx.Request.Context(), userUUID.(string), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create category",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"data": toCategoryResponse(*category),
	})
}

// toCategoryResponse converts a Category to a response excluding ID and UserID
func toCategoryResponse(c store.Category) categoryResponse {
	resp := categoryResponse{
		UUID:      c.UUID.String(),
		Name:      c.Name,
		ColorCode: c.ColorCode,
		IsActive:  c.IsActive,
		SortOrder: c.SortOrder,
		CreatedAt: c.CreatedAt.Time,
		UpdatedAt: c.UpdatedAt.Time,
	}
	
	if c.ParentID.Valid {
		resp.ParentID = c.ParentID.Int32
	}
	
	return resp
}
