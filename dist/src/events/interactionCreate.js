"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../logger"));
const database_1 = require("../database");
const i18n_1 = __importDefault(require("../i18n"));
const config_json_1 = __importDefault(require("../../config.json"));
const runCommand_1 = __importDefault(require("../utils/runCommand"));
const event = {
    name: discord_js_1.Events.InteractionCreate,
    async execute(interaction, commands) {
        if (interaction.isAutocomplete()) {
            const command = commands.get(interaction.commandName);
            if (command?.autocomplete) {
                await command.autocomplete(interaction).catch(logger_1.default.error);
            }
            return;
        }
        if (!interaction.isChatInputCommand())
            return;
        const command = commands.get(interaction.commandName);
        if (!command)
            return;
        const userData = await database_1.db.getUserSettings(interaction.user.id);
        const t = i18n_1.default.getFixedT(userData.language || config_json_1.default.defaultLanguage);
        await (0, runCommand_1.default)(interaction, command, t);
    }
};
exports.default = event;
