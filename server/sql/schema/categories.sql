-- 分类表，支持两层嵌套
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    color_code VARCHAR(7) NOT NULL, -- 颜色值，例如 #RRGGBB
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- 是否启用
    sort_order INTEGER NOT NULL DEFAULT 0, -- 排序字段
    
    deleted_at TIMESTAMPTZ, -- 软删除字段
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    UNIQUE(user_id, parent_id, name) -- 同一用户下同一父分类下的分类名称唯一
);
