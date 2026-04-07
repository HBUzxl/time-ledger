-- name: CreateCategory :one
INSERT INTO categories (user_id, parent_id, name, color_code)
VALUES ($1, $2, $3, $4)
RETURNING *;

-- name: ListCategoriesByUserId :many
SELECT * FROM categories
WHERE user_id = $1 AND is_active = TRUE
ORDER BY sort_order ASC;

-- name: GetCategoryById :one
SELECT * FROM categories
WHERE id = $1 LIMIT 1;