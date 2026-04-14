-- name: CreateUser :one
INSERT INTO users (username, email, password_hash)
VALUES ($1, $2, $3)
RETURNING uuid, username, email, created_at;

-- name: GetUserByEmail :one
SELECT * FROM users
WHERE email = $1 LIMIT 1;