-- name: CreateRawMessage :one
INSERT INTO raw_messages (user_id, message_text)
VALUES ($1, $2)
RETURNING *;

-- name: UpdateMessageProcessed :exec
-- 当用户确认保存记录后，关联 record_id 并标记已处理
-- UPDATE raw_messages
-- SET time_record_id = $2, processed = TRUE, processed_at = NOW(), updated_at = NOW()
-- WHERE id = $1;