"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../logger"));
const i18n_1 = __importDefault(require("../i18n"));
const translator_1 = require("../utils/translator");
const event = {
    name: discord_js_1.Events.ClientReady,
    once: true,
    async execute(client, commands) {
        if (!i18n_1.default.isInitialized) {
            await new Promise((resolve) => i18n_1.default.on('initialized', resolve));
        }
        const slashData = Array.from(commands.values())
            .filter((cmd) => !!cmd.data)
            .map(cmd => {
            const localized = (0, translator_1.localizeCommand)(cmd.data, `commands:${cmd.name}`);
            return localized.toJSON();
        });
        if (slashData.length > 0) {
            const rest = new discord_js_1.REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
            try {
                logger_1.default.info(`Started refreshing ${slashData.length} application commands.`);
                await rest.put(discord_js_1.Routes.applicationCommands(client.user.id), { body: slashData });
                logger_1.default.info(`Successfully reloaded application commands.`);
            }
            catch (error) {
                logger_1.default.error("Faield to deploy application commands:", error);
            }
        }
        logger_1.default.info(`${client.user?.tag} is ready!`);
        logger_1.default.info(`Loaded languages: ${i18n_1.default.languages.join(', ')}`);
    }
};
exports.default = event;
