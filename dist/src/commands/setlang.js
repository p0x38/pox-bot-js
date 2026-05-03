"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = require("../database");
const i18n_1 = __importDefault(require("../i18n"));
const langUtils_1 = require("../utils/langUtils");
const name = 'setlang';
const description = 'Change your display language.';
const setlang = {
    name: name,
    description: description,
    data: new discord_js_1.SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption(option => option.setName('language')
        .setDescription('Select the language to set')
        .setRequired(true)
        .setAutocomplete(true)),
    autocomplete: async (interaction) => {
        const focusedValue = interaction.options.getFocused().toLowerCase();
        const choices = i18n_1.default.languages
            .filter(lang => lang !== 'cimode')
            .map(lang => ({
            name: `${(0, langUtils_1.normalizeLangName)(lang)} (${lang.toUpperCase()})`,
            value: lang
        }));
        const filtered = choices.filter(choice => choice.name.toLowerCase().includes(focusedValue) ||
            choice.value.toLowerCase().includes(focusedValue)).slice(0, 25);
        await interaction.respond(filtered);
    },
    execute: async (context, t, args) => {
        const lang = args.language;
        const userId = context instanceof discord_js_1.Message ? context.author.id : context.user.id;
        if (!i18n_1.default.languages.includes(lang)) {
            const errorMsg = t('common:errors.invalid_language');
            context instanceof discord_js_1.Message
                ? context.reply(errorMsg)
                : context.reply({ content: errorMsg, flags: "Ephemeral" });
        }
        await database_1.db.updateSetting(userId, 'language', lang);
        const newT = i18n_1.default.getFixedT(lang);
        const successMessage = newT('common:lang_updated', {
            lang: (0, langUtils_1.normalizeLangName)(lang)
        });
        if (context instanceof discord_js_1.Message) {
            await context.reply(successMessage);
        }
        else {
            await context.reply({
                content: successMessage,
                flags: "Ephemeral"
            });
        }
    }
};
exports.default = setlang;
