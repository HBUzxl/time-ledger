package handler

import (
	"net/http"
	"strconv"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

type CategoryHandler struct {
	service *service.CategoryService
}

func NewCategoryHandler(service *service.CategoryService) *CategoryHandler {
	return &CategoryHandler{service: service}
}

// ListCategories handles GET /api/v1/categories
func (h *CategoryHandler) ListCategories(ctx *gin.Context) {
	// TODO: Get userID from JWT context once auth middleware is set up
	// For now, getting from query parameter for testing
	userIDStr := ctx.Query("user_id")
	if userIDStr == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "user_id is required",
		})
		return
	}

	userID, err := strconv.ParseInt(userIDStr, 10, 32)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"code":    400,
			"message": "invalid user_id",
		})
		return
	}

	categories, err := h.service.ListCategoriesByUserID(ctx.Request.Context(), int32(userID))
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"code":    500,
			"message": "failed to fetch categories",
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"code": 200,
		"data": categories,
	})
}
