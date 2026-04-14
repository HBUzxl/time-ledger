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
		"/",
		"",    // domain
		false, // secure(https only)
		true,  // httpOnly(不允许 JS 访问, 防止 XSS 攻击)
	)

	ctx.JSON(http.StatusOK, resp)
}
