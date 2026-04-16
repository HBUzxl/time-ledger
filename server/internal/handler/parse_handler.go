package handler

import (
	"net/http"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

type ParseHandler struct {
	service *service.ParseService
}

func NewParseHandler(service *service.ParseService) *ParseHandler {
	return &ParseHandler{service: service}
}

// Parse 解析文本
// POST /api/v1/parse
func (h *ParseHandler) Parse(ctx *gin.Context) {
	var req service.ParseRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body: " + err.Error(),
		})
		return
	}

	userUUID, exists := ctx.Get("user_uuid")
	if !exists {
		ctx.JSON(http.StatusUnauthorized, gin.H{
			"error": "user not authenticated",
		})
		return
	}

	result, err := h.service.Parse(ctx.Request.Context(), userUUID.(string), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to parse: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, result)
}
