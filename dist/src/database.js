"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const pg_1 = require("pg");
require("dotenv/config");
const logger_1 = __importDefault(require("./logger"));
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const pool = new pg_1.Pool({
    host: process.env.PGHOST,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    port: parseInt(process.env.PGPORT || '5432'),
});
pool.on('connect', () => {
    logger_1.default.info('Connected to PostgreSQL');
});
pool.on('error', (err) => {
    logger_1.default.error('PostgreSQL raised an error:', err);
});
exports.db = {
    query: (text, params) => pool.query(text, params),
    // stats (経験値など) を取得
    async getUserStats(userId) {
        const res = await pool.query('SELECT stats FROM user_data WHERE user_id = $1', [userId]);
        return res.rows.length > 0 ? res.rows[0].stats : {};
    },
    async getUserSettings(userId) {
        const res = await pool.query('SELECT settings FROM user_data WHERE user_id = $1', [userId]);
        return res.rows.length > 0 ? res.rows[0].settings : { language: 'en' };
    },
    async updateSetting(userId, key, value) {
        const query = `
            INSERT INTO user_data (user_id, settings)
            VALUES ($1, jsonb_build_object($2, $3))
            ON CONFLICT (user_id)
            DO UPDATE SET settings = user_data.settings || jsonb_build_object($2, $3);
        `;
        await pool.query(query, [userId, key, value]);
    },
    async addExperience(userId, amount) {
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
    async getUserProfile(userId) {
        const res = await this.query('SELECT * FROM user_profile_view WHERE user_id = $1', [userId]);
        return res.rows || null;
    },
    async runMigrations() {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            const categories = ['tables', 'indexes', 'views'];
            const baseDir = node_path_1.default.join(__dirname, '../resources/migrations');
            for (const category of categories) {
                const dir = node_path_1.default.join(baseDir, category);
                if (!(0, node_fs_1.existsSync)(dir))
                    continue;
                const files = (0, node_fs_1.readdirSync)(dir).sort();
                for (const file of files) {
                    const sql = (0, node_fs_1.readFileSync)(node_path_1.default.join(dir, file), 'utf8');
                    await client.query(sql);
                    logger_1.default.info(`Migration applied for '${category}/${file}'.`);
                }
            }
            await client.query('COMMIT');
            logger_1.default.info('All migrations completed successfully.');
        }
        catch (error) {
            await client.query('ROLLBACK');
            logger_1.default.error('Migration failed! Rolled changes back.', error);
            throw error;
        }
        finally {
            client.release();
        }
    },
    pool
};
