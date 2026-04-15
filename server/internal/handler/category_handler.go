package handler

import (
	"net/http"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
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

	respCategories := make([]service.CategoryResponse, len(categories))
	for i, c := range categories {
		respCategories[i] = service.ToCategoryResponse(c)
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
		"data": category,
	})
}
