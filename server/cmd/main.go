package main

import (
	"context"
	"log"
	"time-ledger/internal/config"
	"time-ledger/internal/db"
	"time-ledger/internal/db/store"
	"time-ledger/internal/handler"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5/stdlib"
	"github.com/pressly/goose/v3"
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
	}
	log.Print("数据库连接成功")
	defer dbConn.Close()

	// 初始化 Redis
	rdb := db.NewRedis(context.Background(), config)
	defer rdb.Close()

	// 执行数据库迁移
	dbStdlib := stdlib.OpenDBFromPool(dbConn.Pool)
	if err := goose.Up(dbStdlib, "sql/migrations"); err != nil {
		log.Fatalf("database migration failed: %v", err)
	}
	log.Print("database migration completed")

	// 初始化 store
	queries := store.New(dbConn.Pool)

	// 初始化 services
	categoryService := service.NewCategoryService(queries)
	userService := service.NewUserService(queries, config.JWTSecret, rdb, categoryService)
	recordService := service.NewRecordService(queries)
	keywordService := service.NewKeywordService(queries)
	parseService := service.NewParseService(queries, keywordService)

	r := gin.Default()
	handler.Setup(r, categoryService, userService, recordService, parseService, config.JWTSecret)

	r.Run(":" + config.ServerPort)
}
