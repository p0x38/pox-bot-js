"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localizeCommand = localizeCommand;
const i18n_1 = __importDefault(require("../i18n"));
const DISCORD_LOCALE_MAP = {
    'ja': 'ja',
    'en': 'en-US',
    'ko': 'ko',
    'es': 'es-ES',
    'zh': 'zh-TW'
};
function localizeCommand(builder, commandKey) {
    const descriptionLocalizations = {};
    for (const lang of i18n_1.default.languages) {
        const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;
        const description = i18n_1.default.t(`${commandKey}.description`, { lng: lang });
        if (description !== `${commandKey}.description`) {
            descriptionLocalizations[discordLocale] = description;
        }
    }
    if (typeof builder.setDescriptionLocalizations === 'function') {
        builder.setDescriptionLocalizations(descriptionLocalizations);
    }
    if (builder.options && Array.isArray(builder.options)) {
        builder.options.forEach((option) => {
            if (typeof option.setDescriptionLocalizations === 'function') {
                const optionName = option.name;
                const optionKey = `${commandKey}.options.${optionName}`;
                const oDescLocs = {};
                for (const lang of i18n_1.default.languages) {
                    const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;
                    const oDesc = i18n_1.default.t(`${optionKey}.description`, { lng: lang });
                    if (oDesc !== `${optionKey}.description`) {
                        oDescLocs[discordLocale] = oDesc;
                    }
                }
                option.setDescriptionLocalizations(oDescLocs);
            }
        });
    }
    return builder;
}
