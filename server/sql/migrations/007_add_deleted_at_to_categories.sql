-- +goose Up
-- +goose StatementBegin
ALTER TABLE categories
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_categories_active_only ON categories (user_id) WHERE deleted_at IS NULL;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_categories_active_only;
ALTER TABLE categories DROP COLUMN IF EXISTS deleted_at;
-- +goose StatementEnd
