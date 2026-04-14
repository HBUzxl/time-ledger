package handler

import (
	"net/http"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

type UserHandler struct {
	service *service.UserService
}

func NewUserHandler(service *service.UserService) *UserHandler {
	return &UserHandler{service: service}
}

func (h *UserHandler) Register(ctx *gin.Context) {
	var req service.RegisterRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	resp, refreshToken, err := h.service.Register(ctx.Request.Context(), &req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.SetCookie(
		"refresh_token",
		refreshToken,
		7*24*3600, // 7天
		"/api/v1/auth",
		"",    // domain
		false, // secure(https only)
		true,  // httpOnly(不允许 JS 访问, 防止 XSS 攻击)
	)

	ctx.JSON(http.StatusOK, resp)
}

// Login 用户登录
func (h *UserHandler) Login(ctx *gin.Context) {
	var req service.LoginRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
		})
		return
	}

	resp, refreshToken, err := h.service.Login(ctx.Request.Context(), &req)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.SetCookie(
		"refresh_token",
		refreshToken,
		7*24*3600,      // 7天
		"/api/v1/auth", // 只在认证相关的路径下发送，增加安全性
		"",             // domain
		false,          // secure(https only)
		true,           // httpOnly(不允许 JS 访问, 防止 XSS 攻击)
	)

	ctx.JSON(http.StatusOK, resp)
}

// RefreshToken 刷新 Access Token
func (h *UserHandler) RefreshToken(ctx *gin.Context) {
	// 1. 从 Cookie 中获取 Refresh Token
	oldRefreshToken, err := ctx.Cookie("refresh_token")
	if err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "refresh token not found",
		})
		return
	}

	resp, newRefreshToken, err := h.service.RefreshToken(ctx.Request.Context(), oldRefreshToken)
	if err != nil {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": err.Error(),
		})
		return
	}

	ctx.SetCookie(
		"refresh_token",
		newRefreshToken,
		7*24*3600,      // 7天
		"/api/v1/auth", // 只在认证相关的路径下发送，增加安全性
		"",             // domain
		false,          // secure(https only)
		true,           // httpOnly(不允许 JS 访问, 防止 XSS 攻击)
	)

	ctx.JSON(http.StatusOK, resp)
}
