package service

import (
	"context"
	"errors"
	"fmt"
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

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
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
	key := fmt.Sprintf("refresh_token:%d", user.ID)
	err = s.redis.Set(ctx, key, rt, 7*24*time.Hour).Err()
	if err != nil {
		return nil, "", err
	}

	return &UserResponse{
		ID:          user.ID,
		Username:    user.Username,
		AccessToken: at,
	}, rt, nil
}

// Login 用户登录
func (s *UserService) Login(ctx context.Context, req *LoginRequest) (*UserResponse, string, error) {
	// 1. 根据邮箱获取用户
	user, err := s.store.GetUserByEmail(ctx, req.Email)
	if err != nil {
		// 返回模糊错误信息，避免泄露用户是否存在
		return nil, "", errors.New("invalid email or password")
	}

	// 2. 验证密码
	if !util.CheckPasswordHash(req.Password, user.PasswordHash) {
		return nil, "", errors.New("invalid email or password")
	}

	// 3. 生成 JWT 令牌
	at, rt, err := util.GenerateJWT(user.ID, s.jwtSecret)
	if err != nil {
		return nil, "", err
	}

	// 4. 更新 Redis 中的 Refresh Token
	// 注意，如果是单端登录，直接覆盖；如果是多端登录，可以使用 List 存储多个 Refresh Token
	key := fmt.Sprintf("refresh_token:%d", user.ID)
	err = s.redis.Set(ctx, key, rt, 7*24*time.Hour).Err()
	if err != nil {
		return nil, "", err
	}

	return &UserResponse{
		ID:          user.ID,
		Username:    user.Username,
		AccessToken: at,
	}, rt, nil

}
