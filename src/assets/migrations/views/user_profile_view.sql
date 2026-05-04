DROP VIEW IF EXISTS user_profile_view CASCADE;
CREATE OR REPLACE VIEW user_profile_view AS
WITH base_data AS (
    SELECT 
        user_id,
        COALESCE((stats->>'xp')::BIGINT, 0) AS xp,
        settings->>'language' AS language,
        last_message_at
    FROM user_data
),
calc_level AS (
    SELECT 
        *,
        FLOOR(SQRT(xp / 50)) + 1 AS level
    FROM base_data
),
calc_progress AS (
    SELECT 
        *,
        (POWER(level, 2) * 50)::BIGINT AS next_level_xp_threshold
    FROM calc_level
)
SELECT 
    user_id,
    xp,
    level,
    (next_level_xp_threshold - xp) AS xp_to_next,
    ROUND(
        ((xp - POWER(level - 1, 2) * 50) * 100.0) / 
        (POWER(level, 2) * 50 - POWER(level - 1, 2) * 50)
    ) AS progress_percent,
    RANK() OVER (ORDER BY xp DESC) AS global_rank,
    language,
    last_message_at
FROM calc_progress;