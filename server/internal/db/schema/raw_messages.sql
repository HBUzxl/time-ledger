-- 原始消息表，bot接入
CREATE TABLE raw_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_text TEXT NOT NULL, -- 原始消息文本内容

    -- 解析结果
    time_record_id INTEGER REFERENCES time_records(id) ON DELETE SET NULL, -- 解析出的时间记录ID
        
    processed BOOLEAN NOT NULL DEFAULT FALSE, -- 是否已解析
    processed_at TIMESTAMPTZ, -- 解析时间

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);