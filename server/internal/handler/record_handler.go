package handler

import (
	"net/http"
	"time-ledger/internal/service"

	"github.com/gin-gonic/gin"
)

type RecordHandler struct {
	service *service.RecordService
}

func NewRecordHandler(service *service.RecordService) *RecordHandler {
	return &RecordHandler{service: service}
}

// CreateRecord 创建记录
// POST /api/v1/records
func (h *RecordHandler) CreateRecord(ctx *gin.Context) {
	var req service.CreateRecordRequest
	if err := ctx.ShouldBindJSON(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request body",
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

	record, err := h.service.CreateRecord(ctx.Request.Context(), userUUID.(string), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create record: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, record)
}
