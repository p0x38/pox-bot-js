import {
  config_default
} from "./chunk-JINUGYJW.js";
import {
  logger_default
} from "./chunk-LGWVEOJC.js";

// src/databases/index.ts
import { Pool } from "pg";
import "dotenv/config";
import path from "path";
import { existsSync, readdirSync, readFileSync } from "fs";

// src/databases/defaults.ts
var DEFAULT_GUILD_SETTINGS = {
  guildId: "",
  prefix: config_default.bot_prefix,
  language: config_default.defaultLanguage,
  defaultCooldown: 1500,
  roleCooldowns: {},
  disabledCommands: [],
  personality: {
    type: "casual",
    intensity: "normal"
  },
  emotion: "happy"
};

// src/databases/index.ts
var guildCache = /* @__PURE__ */ new Map();
var pool = new Pool({
  host: process.env.PGHOST,
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  database: process.env.PGDATABASE,
  port: parseInt(process.env.PGPORT || "5432")
});
pool.on("connect", () => {
  logger_default.info("Connected to PostgreSQL");
});
pool.on("error", (err) => {
  logger_default.error("PostgreSQL raised an error:", err);
});
var db = {
  query: (text, params) => pool.query(text, params),
  async getUserStats(userId) {
    const res = await pool.query(
      "SELECT stats FROM user_data WHERE user_id = $1",
      [userId]
    );
    return res.rows.length > 0 ? res.rows[0].stats : {};
  },
  async getUserSettings(userId) {
    const res = await pool.query(
      "SELECT settings FROM user_data WHERE user_id = $1",
      [userId]
    );
    return res.rows.length > 0 ? res.rows[0].settings : { language: "en" };
  },
  async updateSetting(userId, settingsObj) {
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
  async getGuildSettings(guildId) {
    if (guildCache.has(guildId)) {
      return guildCache.get(guildId);
    }
    const res = await pool.query(
      "SELECT settings FROM guild_data WHERE guild_id = $1",
      [guildId]
    );
    let settings;
    if (res.rows.length === 0) {
      settings = {
        ...DEFAULT_GUILD_SETTINGS,
        guildId
      };
      await pool.query(
        `INSERT INTO guild_data (guild_id, settings)
                VALUES ($1, $2::jsonb)
                ON CONFLICT (guild_id) DO NOTHING`,
        [guildId, JSON.stringify(settings)]
      );
    } else {
      settings = {
        ...DEFAULT_GUILD_SETTINGS,
        ...res.rows[0].settings,
        guildId
      };
    }
    guildCache.set(guildId, settings);
    return settings;
  },
  async updateGuildSetting(guildId, settingsObj) {
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
  async addExperience(userId, amount) {
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
  async getUserProfile(userId) {
    const res = await this.query(
      "SELECT * FROM user_profile_view WHERE user_id = $1",
      [userId]
    );
    return res.rows;
  },
  async getTopUsers(limit = 10) {
    const query = `
            SELECT user_id, xp, level, global_rank
            FROM user_profile_view
            ORDER BY xp DESC
            LIMIT $1;
        `;
    const res = await pool.query(query, [limit]);
    return res.rows;
  },
  async runMigrations() {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const categories = ["tables", "indexes", "views"];
      const baseDir = path.join(
        import.meta.dirname,
        "../assets/migrations"
      );
      for (const category of categories) {
        const dir = path.join(baseDir, category);
        if (!existsSync(dir)) continue;
        const files = readdirSync(dir).sort();
        for (const file of files) {
          const sql = readFileSync(path.join(dir, file), "utf8");
          await client.query(sql);
          logger_default.info(`Migration applied for '${category}/${file}'.`);
        }
      }
      await client.query("COMMIT");
      logger_default.info("All migrations completed successfully.");
    } catch (error) {
      await client.query("ROLLBACK");
      logger_default.error("Migration failed! Rolled changes back.", error);
      throw error;
    } finally {
      client.release();
    }
  },
  pool
};

export {
  db
};
