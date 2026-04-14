package db

import (
	"context"
	"fmt"
	"log"
	"time-ledger/internal/config"

	"github.com/redis/go-redis/v9"
)

func NewRedis(ctx context.Context, cfg *config.Config) *redis.Client {
	rdb := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", cfg.RedisHost, cfg.RedisPort),
		Password: cfg.RedisPassword,
		DB:       cfg.RedisDB,
	})

	// 测试连接
	if err := rdb.Ping(ctx).Err(); err != nil {
		log.Printf("Warning: Redis connection failed: %v", err)
		return nil
	}

	log.Println("Redis connection successful")
	return rdb
}
