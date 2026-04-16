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

	result, err := h.service.CreateRecord(ctx.Request.Context(), userUUID.(string), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to create record: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusCreated, result)
}

// ListRecords 获取记录列表
// GET /api/v1/records
func (h *RecordHandler) ListRecords(ctx *gin.Context) {
	var req service.ListRecordsRequest
	if err := ctx.ShouldBindQuery(&req); err != nil {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "invalid request: " + err.Error(),
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

	records, err := h.service.ListRecords(ctx.Request.Context(), userUUID.(string), req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to list records: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, records)
}

// UpdateRecord 更新记录
// PUT /api/v1/records/:uuid
func (h *RecordHandler) UpdateRecord(ctx *gin.Context) {
	recordUUID := ctx.Param("uuid")
	if recordUUID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "record uuid is required",
		})
		return
	}

	var req service.UpdateRecordRequest
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

	result, err := h.service.UpdateRecord(ctx.Request.Context(), userUUID.(string), recordUUID, req)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to update record: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, result)
}

// DeleteRecord 删除记录
// DELETE /api/v1/records/:uuid
func (h *RecordHandler) DeleteRecord(ctx *gin.Context) {
	recordUUID := ctx.Param("uuid")
	if recordUUID == "" {
		ctx.JSON(http.StatusBadRequest, gin.H{
			"error": "record uuid is required",
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

	err := h.service.DeleteRecord(ctx.Request.Context(), userUUID.(string), recordUUID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, gin.H{
			"error": "failed to delete record: " + err.Error(),
		})
		return
	}

	ctx.JSON(http.StatusOK, gin.H{
		"message": "record deleted successfully",
	})
}
