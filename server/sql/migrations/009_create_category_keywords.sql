-- +goose Up
-- +goose StatementBegin
CREATE TABLE category_keywords (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,
    keyword_type VARCHAR(20) DEFAULT 'user',
    UNIQUE(category_id, keyword),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_category_keywords_category_id ON category_keywords(category_id);
CREATE INDEX IF NOT EXISTS idx_category_keywords_keyword ON category_keywords(keyword);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP INDEX IF EXISTS idx_category_keywords_keyword;
DROP INDEX IF EXISTS idx_category_keywords_category_id;
DROP TABLE IF EXISTS category_keywords;
-- +goose StatementEnd