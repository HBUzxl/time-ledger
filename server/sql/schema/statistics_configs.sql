-- 统计偏好表, “有效时间”、“无效时间”自定义统计维度
CREATE TABLE statistics_configs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    config_name VARCHAR(255) NOT NULL, -- 配置名称，例如 "有效维度"
    category_ids INTEGER[], -- 关联的分类ID列表，统计时包含这些分类的数据

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);