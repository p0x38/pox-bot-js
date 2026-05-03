CREATE OR REPLACE VIEW user_profile_view AS
SELECT 
    user_id,
    COALESCE((stats->>'xp')::BIGINT, 0) AS xp,
    FLOOR(SQRT(COALESCE((stats->>'xp')::BIGINT, 0) / 50)) + 1 AS level,
    RANK() OVER (ORDER BY COALESCE((stats->>'xp')::BIGINT, 0) DESC) AS global_rank,
    settings->>'language' AS language,
    last_message_at
FROM user_data;