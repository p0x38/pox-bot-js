CREATE TABLE IF NOT EXISTS user_data (
    user_id VARCHAR(65535) PRIMARY KEY,
    data JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_user_data_language ON user_data ((data->>'language'));