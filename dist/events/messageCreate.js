import {
  runCommand_default
} from "../chunk-36TPF7Y6.js";
import {
  db
} from "../chunk-QR4SPJXM.js";
import "../chunk-MTF4G4PS.js";
import {
  config_default
} from "../chunk-JINUGYJW.js";
import {
  logger_default
} from "../chunk-LGWVEOJC.js";

// src/events/messageCreate.ts
import { Events } from "discord.js";
import i18next from "i18next";

// src/services/xpService.ts
var cooldowns = /* @__PURE__ */ new Map();
var COOLDOWN = 45 * 1e3;
async function handleMessage(message) {
  const userId = message.author.id;
  const now = Date.now();
  const last = cooldowns.get(userId) || 0;
  if (now - last < COOLDOWN) return null;
  cooldowns.set(userId, now);
  const content = message.cleanContent;
  if (!content || content.length < 5) return null;
  if (/^[^a-zA-Z0-9]+$/.test(content)) return null;
  const lastMsgKey = `${userId}:lastMsg`;
  if (global[lastMsgKey] === content) return null;
  global[lastMsgKey] = content;
  const words = content.split(/\s+/).length;
  const letters = content.replace(/\s+/g, "").length;
  const xp = Math.floor(5 * (words / 30 + letters / 30 / 6)) + Math.floor(Math.random() * 5);
  if (xp <= 0) return null;
  const before = await db.getUserProfile(userId);
  const oldLevel = before?.[0]?.level || 1;
  await db.addExperience(userId, xp);
  const after = await db.getUserProfile(userId);
  const newLevel = after?.[0]?.level || 1;
  return { leveledUp: newLevel > oldLevel, newLevel };
}

// src/events/messageCreate.ts
var event = {
  name: Events.MessageCreate,
  async execute(message, commands) {
    if (message.author.bot) return;
    const userSettings = await db.getUserSettings(message.author.id);
    const lang = userSettings.language || "en";
    const t = i18next.getFixedT(lang);
    const isCommand = message.content.startsWith(config_default.bot_prefix);
    if (!isCommand) {
      try {
        const result = await handleMessage(message);
        if (result?.leveledUp) {
          await message.reply(
            t("common:messages.levelup", {
              level: result.newLevel
            })
          );
        }
      } catch (err) {
        logger_default.error("XP system failed:", err);
      }
    }
    if (!isCommand) return;
    const args = message.content.slice(config_default.bot_prefix.length).trim().split(/\s+/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) return;
    const command = commands.get(commandName);
    if (!command) return;
    try {
      await runCommand_default(message, command);
    } catch (err) {
      logger_default.error(`Command execution failed for ${commandName}:`, err);
    }
  }
};
var messageCreate_default = event;
export {
  messageCreate_default as default
};
