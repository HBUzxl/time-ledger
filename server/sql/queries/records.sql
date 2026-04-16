-- name: CreateRecord :one
INSERT INTO time_records (
    user_id, category_id, start_time, end_time, duration_minutes, note, source
) VALUES (
    $1, $2, $3, $4, $5, $6, $7
) RETURNING *;

-- name: CheckOverlap :one
-- 检查时间是否重叠
SELECT EXISTS (
    SELECT 1 FROM time_records
    WHERE user_id = $1
    AND (start_time, end_time) OVERLAPS ($2, $3)
);

-- name: GetDailyRecords :many
-- 获取用户在指定日期范围内的时间记录
SELECT * FROM time_records
WHERE user_id = $1
AND start_time >= $2
AND start_time < $3
ORDER BY start_time ASC;

-- name: GetRecords :many
-- 获取记录列表（支持分页和日期过滤）
SELECT tr.*, c.uuid as category_uuid
FROM time_records tr
LEFT JOIN categories c ON tr.category_id = c.id
WHERE tr.user_id = $1
AND tr.start_time >= $2
AND tr.start_time < $3
ORDER BY tr.start_time DESC
LIMIT $4 OFFSET $5;

-- name: CountRecords :one
-- 统计记录数量
SELECT COUNT(*)
FROM time_records tr
WHERE tr.user_id = $1
AND tr.start_time >= $2
AND tr.start_time < $3;

-- name: GetRecordByUUID :one
-- 根据UUID获取单条记录
SELECT tr.*, c.uuid as category_uuid
FROM time_records tr
LEFT JOIN categories c ON tr.category_id = c.id
WHERE tr.uuid = $1 AND tr.user_id = $2;

-- name: UpdateRecord :one
-- 更新记录
UPDATE time_records
SET category_id = $2, start_time = $3, end_time = $4, duration_minutes = $5, note = $6, updated_at = NOW()
WHERE uuid = $1 AND user_id = $7
RETURNING *;

-- name: DeleteRecord :exec
-- 删除记录
DELETE FROM time_records WHERE uuid = $1 AND user_id = $2;