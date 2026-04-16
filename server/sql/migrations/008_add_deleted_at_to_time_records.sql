-- +goose Up
-- +goose StatementBegin
ALTER TABLE time_records ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE time_records DROP COLUMN IF EXISTS deleted_at;
-- +goose StatementEnd