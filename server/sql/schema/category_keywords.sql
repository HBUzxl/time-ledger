-- 分类关键词表
CREATE TABLE category_keywords (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    keyword VARCHAR(100) NOT NULL,  -- 存储时转为小写

    keyword_type VARCHAR(20) DEFAULT 'user',  -- 'system' 或 'user'

    UNIQUE(category_id, keyword),  -- 同一分类下的关键词唯一

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ  -- 软删除字段
);