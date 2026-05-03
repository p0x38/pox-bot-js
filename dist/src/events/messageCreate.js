"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = require("../database");
const config_json_1 = __importDefault(require("../../config.json"));
const logger_1 = __importDefault(require("../logger"));
const runCommand_1 = __importDefault(require("../utils/runCommand"));
const i18next_1 = __importDefault(require("i18next"));
const event = {
    name: discord_js_1.Events.MessageCreate,
    async execute(message, commands) {
        if (message.author.bot)
            return;
        const userSettings = await database_1.db.getUserSettings(message.author.id);
        const lang = userSettings.language || 'en';
        const t = i18next_1.default.getFixedT(lang);
        try {
            const oldProfile = await database_1.db.getUserProfile(message.author.id);
            const oldLevel = oldProfile?.level || 1;
            const messageContent = message.cleanContent;
            const messageWords = messageContent.split(/\s+/).length;
            const messageLetters = messageContent.length;
            const finalXpToAdd = 5 * ((messageWords / 30) + (messageLetters / 30) / 6);
            await database_1.db.addExperience(message.author.id, finalXpToAdd | 0);
            const newProfile = await database_1.db.getUserProfile(message.author.id);
            const newLevel = newProfile?.level || 1;
            if (newLevel > oldLevel) {
                await message.reply(t('common:levelup', { level: newLevel, lng: lang }));
            }
        }
        catch (err) {
            logger_1.default.error('XP Update failed:', err);
        }
        if (!message.content.startsWith(config_json_1.default.bot_prefix))
            return;
        const args = message.content.slice(config_json_1.default.bot_prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName)
            return;
        const command = commands.get(commandName);
        if (command) {
            await (0, runCommand_1.default)(message, command, t);
        }
    }
};
exports.default = event;
