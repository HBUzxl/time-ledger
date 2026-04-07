-- +goose Up
-- +goose StatementBegin
CREATE TABLE IF NOT EXISTS time_records (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    note TEXT,
    source VARCHAR(255) NOT NULL DEFAULT 'manual',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_time CHECK (end_time > start_time)
);

CREATE INDEX IF NOT EXISTS idx_records_user ON time_records(user_id, start_time, end_time);
CREATE INDEX IF NOT EXISTS idx_records_category ON time_records(category_id);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS time_records CASCADE;
-- +goose StatementEnd
