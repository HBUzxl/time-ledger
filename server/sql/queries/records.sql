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