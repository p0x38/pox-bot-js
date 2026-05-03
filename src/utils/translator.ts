import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from "discord.js";
import i18next from "../i18n";

const DISCORD_LOCALE_MAP: Record<string, any> = {
    'ja': 'ja',
    'en': 'en-US',
    'ko': 'ko',
    'es': 'es-ES',
    'zh': 'zh-TW'
};

export function localizeCommand(
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
    commandKey: string
) {
    const descriptionLocalizations: Record<string, string> = {};

    for (const lang of i18next.languages) {
        const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;

        const description = i18next.t(`${commandKey}.description`, { lng: lang });

        if (description !== `${commandKey}.description`) {
            descriptionLocalizations[discordLocale] = description;
        }
    }

    if (typeof builder.setDescriptionLocalizations === 'function') {
        builder.setDescriptionLocalizations(descriptionLocalizations);
    }

    if (builder.options && Array.isArray(builder.options)) {
        builder.options.forEach((option: any) => {
            if (typeof option.setDescriptionLocalizations === 'function') {
                const optionName = option.name;
                const optionKey = `${commandKey}.options.${optionName}`;
                const oDescLocs: Record<string, string> = {};

                for (const lang of i18next.languages) {
                    const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;
                    const oDesc = i18next.t(`${optionKey}.description`, { lng: lang });

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