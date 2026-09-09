import { GuildSettings } from '@/guilds/types';

import { DEFAULT_GUILD_SETTINGS } from './defaults';
import { pool } from './pool';

const guildCache = new Map<string, GuildSettings>();

export const guildRepo = {
    async getGuildSettings(guildId: string): Promise<GuildSettings> {
        if (guildCache.has(guildId)) {
            return guildCache.get(guildId)!;
        }

        const res = await pool.query(
            'SELECT settings FROM guild_data WHERE guild_id = $1',
            [guildId],
        );

        let settings: GuildSettings;

        if (res.rows.length === 0) {
            settings = { ...DEFAULT_GUILD_SETTINGS, guildId };

            await pool.query(
                `INSERT INTO guild_data (guild_id, settings)
                VALUES ($1, $2::jsonb)
                ON CONFLICT (guild_id) DO NOTHING`,
                [guildId, JSON.stringify(settings)],
            );
        } else {
            settings = {
                ...DEFAULT_GUILD_SETTINGS,
                ...res.rows[0].settings,
                guildId,
            };
        }

        guildCache.set(guildId, settings);
        return settings;
    },

    async updateGuildSetting(guildId: string, settingsObj: object) {
        const sql = `
            INSERT INTO guild_data (guild_id, settings)
            VALUES ($1, $2::jsonb)
            ON CONFLICT (guild_id)
            DO UPDATE SET
                settings = guild_data.settings || EXCLUDED.settings,
                updated_at = CURRENT_TIMESTAMP;
        `;
        await pool.query(sql, [guildId, JSON.stringify(settingsObj)]);

        const current = await this.getGuildSettings(guildId);
        const updated = { ...current, ...settingsObj };
        guildCache.set(guildId, updated);
    },
};
