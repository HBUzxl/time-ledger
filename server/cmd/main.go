package main

import (
	"context"
	"log"
	"net/http"
	"time-ledger/internal/config"
	"time-ledger/internal/db"
	"time-ledger/internal/db/store"
	"time-ledger/internal/handler"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	config, err := config.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	// 初始化数据库
	dbConn, err := db.NewDB(context.Background(), config)
	if err != nil {
		log.Fatal(err)
	} else {
		log.Print("数据库连接成功")
	}
	defer dbConn.Close()

	// 初始化 store
	queries := store.New(dbConn.Pool)

	// 初始化 services
	categoryService := service.NewCategoryService(queries)

	r := gin.Default()

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	// 注册 API v1 路由
	v1 := r.Group("/api/v1")
	handler.RegisterRoutes(v1, categoryService)

	r.Run(":" + config.ServerPort)
}
