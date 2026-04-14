package service

import (
	"context"
	"errors"
	"time"
	"time-ledger/internal/db/store"
	"time-ledger/internal/util"

	"github.com/redis/go-redis/v9"
)

type UserService struct {
	store     *store.Queries
	jwtSecret string
	redis     *redis.Client
}

func NewUserService(store *store.Queries, jwtSecret string, rdb *redis.Client) *UserService {
	return &UserService{store: store, jwtSecret: jwtSecret, redis: rdb}
}

type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=20"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

type UserResponse struct {
	ID          int32  `json:"id"`
	Username    string `json:"username"`
	AccessToken string `json:"access_token"`
}

// Register 用户注册
func (s *UserService) Register(ctx context.Context, req *RegisterRequest) (*UserResponse, string, error) {
	// 1. 检查邮箱是否已注册
	_, err := s.store.GetUserByEmail(ctx, req.Email)
	if err == nil {
		return nil, "", errors.New("email already registered")
	}

	// 2. 密码加盐哈希
	hashedPwd, err := util.HashPassword(req.Password)
	if err != nil {
		return nil, "", err
	}

	// 3. 创建用户
	user, err := s.store.CreateUser(ctx, store.CreateUserParams{
		Username:     req.Username,
		Email:        req.Email,
		PasswordHash: hashedPwd,
	})
	if err != nil {
		return nil, "", err
	}

	// 4. 生成 JWT 令牌
	at, rt, err := util.GenerateJWT(user.ID, s.jwtSecret)
	if err != nil {
		return nil, "", err
	}

	// 5. 将 Refresh Token存储在 Redis 中，设置过期时间为7天
	err = s.redis.Set(ctx, "refresh_token:"+rt, user.ID, 7*24*time.Hour).Err()
	if err != nil {
		return nil, "", err
	}

	return &UserResponse{
		ID:          user.ID,
		Username:    user.Username,
		AccessToken: at,
	}, rt, nil
}
