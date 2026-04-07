package handler

import (
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

// RegisterRoutes 注册分类相关路由
func RegisterRoutes(r *gin.RouterGroup, categoryService *service.CategoryService) {
	handler := NewCategoryHandler(categoryService)
	
	categories := r.Group("/categories")
	{
		categories.GET("", handler.ListCategories)
	}
}
