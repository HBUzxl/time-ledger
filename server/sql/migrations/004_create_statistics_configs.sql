-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS statistics_configs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    config_name VARCHAR(255) NOT NULL,
    category_ids INTEGER[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS statistics_configs CASCADE;
-- +goose StatementEnd
