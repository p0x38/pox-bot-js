import { Pool } from 'pg';
import { UserSettings } from './types';
import 'dotenv/config';
import logger from './logger';
import path from 'node:path';
import { existsSync, readdirSync, readFileSync } from 'node:fs';

const pool = new Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: parseInt(process.env.PGPORT || '5432'),
});

pool.on('connect', () => {
    logger.info('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    logger.error('PostgreSQL raised an error:', err);
});

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),

    // stats (経験値など) を取得
    async getUserStats(userId: string) {
        const res = await pool.query('SELECT stats FROM user_data WHERE user_id = $1', [userId]);
        return res.rows.length > 0 ? res.rows[0].stats : {};
    },
    async getUserSettings(userId: string): Promise<UserSettings> {
        const res = await pool.query('SELECT settings FROM user_data WHERE user_id = $1', [userId]);
        return res.rows.length > 0 ? (res.rows[0].settings as UserSettings) : { language: 'en' };
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
            );
        `;
        await pool.query(query, [userId, amount]);
    },
    async getUserProfile(userId: string) {
        const res = await this.query(
            'SELECT * FROM user_profile_view WHERE user_id = $1',
            [userId]
        );
        return res.rows || null;
    },
    async runMigrations() {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const categories = ['tables', 'indexes', 'views'];
            const baseDir = path.join(__dirname, '../resources/migrations');

            for (const category of categories) {
                const dir = path.join(baseDir, category);
                if (!existsSync(dir)) continue;

                const files = readdirSync(dir).sort();
                for (const file of files) {
                    const sql = readFileSync(path.join(dir, file), 'utf8');
                    await client.query(sql);
                    logger.info(`Migration applied for '${category}/${file}'.`);
                }
            }
            await client.query('COMMIT');
            logger.info('All migrations completed successfully.');
        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Migration failed! Rolled changes back.', error);
            throw error;
        } finally {
            client.release();
        }
    },
    pool
};