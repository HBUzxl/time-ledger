-- 时间记录表
CREATE TABLE time_records (
    id SERIAL PRIMARY KEY,
    uuid UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,

    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL, -- 冗余字段，方便查询和统计
    note TEXT,  -- 备注信息

    source VARCHAR(255) NOT NULL DEFAULT 'manual', -- 记录来源，web、app、web、tg_bot 等

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()

    -- 约束：结束时间必须大于开始时间
    CONSTRAINT chk_time CHECK (end_time > start_time)
);

CREATE INDEX idx_records_user ON time_records(user_id, start_time, end_time);
CREATE INDEX idx_records_category ON time_records(category_id);