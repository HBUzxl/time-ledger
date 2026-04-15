package handler

import (
	"net/http"
	"time-ledger/internal/middleware"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

// Setup 注册所有路由
func Setup(r *gin.Engine, categoryService *service.CategoryService, userService *service.UserService, recordService *service.RecordService, jwtSecret string) {
	// 健康检查
	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	// 注册 API v1 路由
	v1 := r.Group("/api/v1")
	registerV1Routes(v1, categoryService, userService, recordService, jwtSecret)
}

// registerV1Routes 注册 v1 版本 API 路由
func registerV1Routes(r *gin.RouterGroup, categoryService *service.CategoryService, userService *service.UserService, recordService *service.RecordService, jwtSecret string) {
	categoryHandler := NewCategoryHandler(categoryService)
	userHandler := NewUserHandler(userService)
	recordHandler := NewRecordHandler(recordService)

	// 认证模块
	auth := r.Group("/auth")
	{
		auth.POST("/register", userHandler.Register)
		auth.POST("/login", userHandler.Login)
		auth.POST("/refresh", userHandler.RefreshToken)
	}

	categories := r.Group("/categories")
	{
		categories.Use(middleware.AuthMiddleware(jwtSecret))
		categories.GET("", categoryHandler.ListCategories)
		categories.POST("", categoryHandler.CreateCategory)
		categories.PUT("/:uuid", categoryHandler.UpdateCategory)
	}

	records := r.Group("/records")
	{
		records.Use(middleware.AuthMiddleware(jwtSecret))
		records.POST("", recordHandler.CreateRecord)
	}

	// users := r.Group("/users")
	// {
	// 	users.POST("/register", userHandler.Register)
	// }
}
