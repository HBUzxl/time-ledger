-- +goose Up
-- +goose StatementBegin
ALTER TABLE users ADD COLUMN uuid UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE users ADD CONSTRAINT users_uuid_key UNIQUE (uuid);

ALTER TABLE categories ADD COLUMN uuid UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE categories ADD CONSTRAINT categories_uuid_key UNIQUE (uuid);

ALTER TABLE time_records ADD COLUMN uuid UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE time_records ADD CONSTRAINT time_records_uuid_key UNIQUE (uuid);
-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_uuid_key;
ALTER TABLE users DROP COLUMN IF EXISTS uuid;

ALTER TABLE categories DROP CONSTRAINT IF EXISTS categories_uuid_key;
ALTER TABLE categories DROP COLUMN IF EXISTS uuid;

ALTER TABLE time_records DROP CONSTRAINT IF EXISTS time_records_uuid_key;
ALTER TABLE time_records DROP COLUMN IF EXISTS uuid;
-- +goose StatementEnd
