-- name: CreateCategory :one
INSERT INTO categories (user_id, parent_id, name, color_code, sort_order)
VALUES ($1, $2, $3, $4, $5)
RETURNING *;

-- name: ListCategoriesByUserId :many
SELECT * FROM categories
WHERE user_id = $1 AND is_active = TRUE AND deleted_at IS NULL
ORDER BY sort_order ASC;

-- name: GetCategoryByID :one
SELECT * FROM categories
WHERE id = $1 AND deleted_at IS NULL
LIMIT 1;

-- name: GetCategoryByUUID :one
SELECT * FROM categories
WHERE uuid = $1 AND deleted_at IS NULL
LIMIT 1;

-- name: UpdateCategory :one
UPDATE categories
SET name = COALESCE(sqlc.narg('name'), name),
    color_code = COALESCE(sqlc.narg('color_code'), color_code),
    is_active = COALESCE(sqlc.narg('is_active'), is_active),
    sort_order = COALESCE(sqlc.narg('sort_order'), sort_order),
    parent_id = COALESCE(sqlc.narg('parent_id'), parent_id),
    updated_at = NOW()
WHERE uuid = sqlc.arg('uuid')
  AND deleted_at IS NULL
RETURNING *;

-- name: DeleteCategory :exec
UPDATE categories
SET deleted_at = NOW(),
    updated_at = NOW()
WHERE uuid = sqlc.arg('uuid')
  AND deleted_at IS NULL;

-- name: CountSubCategories :one
SELECT COUNT(*) FROM categories
WHERE parent_id = sqlc.arg('parent_id')
  AND user_id = sqlc.arg('user_id')
  AND deleted_at IS NULL;

-- name: GetCategoriesByIDs :many
SELECT * FROM categories
WHERE id = ANY($1::int[])
  AND deleted_at IS NULL;