package handler

import (
	"net/http"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

// Setup 注册所有路由
func Setup(r *gin.Engine, categoryService *service.CategoryService) {
	// 健康检查
	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	// 注册 API v1 路由
	v1 := r.Group("/api/v1")
	registerV1Routes(v1, categoryService)
}

// registerV1Routes 注册 v1 版本 API 路由
func registerV1Routes(r *gin.RouterGroup, categoryService *service.CategoryService) {
	handler := NewCategoryHandler(categoryService)

	categories := r.Group("/categories")
	{
		categories.GET("", handler.ListCategories)
	}
}
