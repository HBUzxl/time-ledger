package main

import (
	"context"
	"log"
	"net/http"
	"time-ledger/internal/config"
	"time-ledger/internal/db"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	config, err := config.LoadConfig()
	if err != nil {
		log.Fatal(err)
	}

	// 初始化数据库
	db, err := db.NewDB(context.Background(), config)
	if err != nil {
		log.Fatal(err)
	} else {
		log.Print("数据库连接成功")
	}
	defer db.Close()

	r := gin.Default()

	r.GET("/health", func(ctx *gin.Context) {
		ctx.JSON(http.StatusOK, gin.H{
			"status": "ok",
		})
	})

	r.Run(":" + config.ServerPort)
}
