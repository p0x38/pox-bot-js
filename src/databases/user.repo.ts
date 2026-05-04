import { pool } from './pool';
import { UserSettings } from '../types';

export const userRepo = {
    async getUserStats(userId: string) {
        const res = await pool.query(
            'SELECT stats FROM user_data WHERE user_id = $1',
            [userId],
        );
        return res.rows.length > 0 ? res.rows[0].stats : {};
    },

    async getUserSettings(userId: string): Promise<UserSettings> {
        const res = await pool.query(
            'SELECT settings FROM user_data WHERE user_id = $1',
            [userId],
        );
        return res.rows.length > 0
            ? (res.rows[0].settings as UserSettings)
            : { language: 'en' };
    },

    async updateSetting(userId: string, settingsObj: object) {
        const sql = `
            INSERT INTO user_data (user_id, settings)
            VALUES ($1, $2::jsonb)
            ON CONFLICT (user_id)
            DO UPDATE SET
                settings = user_data.settings || EXCLUDED.settings,
                updated_at = CURRENT_TIMESTAMP;
        `;
        await pool.query(sql, [userId, JSON.stringify(settingsObj)]);
    },

    async addExperience(userId: string, amount: number) {
        const query = `
            INSERT INTO user_data (user_id, stats)
            VALUES ($1, jsonb_build_object('xp', $2::bigint))
            ON CONFLICT (user_id) DO UPDATE SET
            stats = jsonb_set(
                COALESCE(user_data.stats, '{}'::jsonb),
                '{xp}',
                (COALESCE(user_data.stats->>'xp', '0')::bigint + $2::bigint)::text::jsonb
            ),
            last_message_at = CURRENT_TIMESTAMP;
        `;
        await pool.query(query, [userId, amount]);
    },

    async getUserProfile(userId: string) {
        const res = await pool.query(
            'SELECT * FROM user_profile_view WHERE user_id = $1',
            [userId],
        );
        return res.rows;
    },

    async getTopUsers(limit: number = 10): Promise<any[]> {
        const query = `
            SELECT user_id, xp, level, global_rank
            FROM user_profile_view
            ORDER BY xp DESC
            LIMIT $1;
        `;
        const res = await pool.query(query, [limit]);
        return res.rows;
    },
};
