package config

import (
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	ServerPort string // 服务端口

	// 数据库配置
	DBHost     string // 数据库主机
	DBPort     string // 数据库端口
	DBUser     string // 数据库用户名
	DBPassword string // 数据库密码
	DBName     string // 数据库名称
	DBSSLMode  string // 数据库SSL模式

	// JWT 配置
	JWTSecret string // JWT 密钥

	// Redis 配置
	RedisHost     string // Redis 主机
	RedisPort     string // Redis 端口
	RedisPassword string // Redis 密码
	RedisDB       int    // Redis 数据库编号
}

func LoadConfig() (*Config, error) {
	if err := godotenv.Load(); err != nil {
		return nil, err
	}

	cfg := &Config{
		ServerPort:    getEnv("SERVER_PORT", "8080"),
		DBHost:        getEnv("DB_HOST", "localhost"),
		DBPort:        getEnv("DB_PORT", "5432"),
		DBUser:        getEnv("DB_USER", "postgres"),
		DBPassword:    getEnv("DB_PASSWORD", "postgres"),
		DBName:        getEnv("DB_NAME", "time_ledger"),
		DBSSLMode:     getEnv("DB_SSLMODE", "disable"),
		JWTSecret:     getEnv("JWT_SECRET", "your-secret-key"),
		RedisHost:     getEnv("REDIS_HOST", "localhost"),
		RedisPort:     getEnv("REDIS_PORT", "6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		RedisDB:       0,
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
