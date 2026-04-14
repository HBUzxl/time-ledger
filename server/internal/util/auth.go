package util

import (
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

// HashPassword 哈希加密
func HashPassword(password string) (string, error) {
	hashedBytes, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashedBytes), nil
}

// CheckPasswordHash 验证密码
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

// GenerateJWT 生成访问令牌和刷新令牌
func GenerateJWT(userUUID uuid.UUID, secretKey string) (at string, rt string, err error) {
	// Access Token, 有效期15分钟
	atClaims := jwt.MapClaims{
		"sub": userUUID.String(),
		"exp": time.Now().Add(15 * time.Minute).Unix(),
	}
	atToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, atClaims).SignedString([]byte(secretKey))
	if err != nil {
		return "", "", err
	}

	// Refresh Token, 有效期7天
	rtClaims := jwt.MapClaims{
		"sub": userUUID.String(),
		"exp": time.Now().Add(7 * 24 * time.Hour).Unix(),
	}
	rtToken, err := jwt.NewWithClaims(jwt.SigningMethodHS256, rtClaims).SignedString([]byte(secretKey))
	if err != nil {
		return "", "", err
	}

	return atToken, rtToken, nil
}
