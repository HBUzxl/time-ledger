-- name: CreateKeyword :one
INSERT INTO category_keywords (category_id, keyword, keyword_type)
VALUES ($1, LOWER($2), $3)
RETURNING *;

-- name: ListKeywordsByCategoryID :many
SELECT * FROM category_keywords
WHERE category_id = $1 AND deleted_at IS NULL
ORDER BY created_at DESC;

-- name: GetKeywordByID :one
SELECT * FROM category_keywords
WHERE id = $1 AND deleted_at IS NULL
LIMIT 1;

-- name: SearchKeyword :many
SELECT ck.* FROM category_keywords ck
JOIN categories c ON ck.category_id = c.id
WHERE ck.keyword = LOWER($1)
  AND ck.deleted_at IS NULL
  AND c.deleted_at IS NULL
  AND c.user_id = $2;

-- name: UpdateKeyword :one
UPDATE category_keywords
SET keyword = COALESCE(sqlc.narg('keyword'), keyword),
    keyword_type = COALESCE(sqlc.narg('keyword_type'), keyword_type),
    updated_at = NOW()
WHERE id = sqlc.arg('id')
  AND deleted_at IS NULL
RETURNING *;

-- name: DeleteKeyword :exec
UPDATE category_keywords
SET deleted_at = NOW(),
    updated_at = NOW()
WHERE id = $1
  AND deleted_at IS NULL;