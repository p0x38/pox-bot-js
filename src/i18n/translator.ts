import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import i18next, { languages } from '../i18n';

const DISCORD_LOCALE_MAP: Record<string, any> = {
    ja: 'ja',
    en: 'en-US',
    ko: 'ko',
    es: 'es-ES',
    zh: 'zh-TW',
};

export function localizeCommand(
    builder: SlashCommandBuilder | SlashCommandSubcommandBuilder,
    commandKey: string,
) {
    const descriptionLocalizations: Record<string, string> = {};

    for (const lang of languages) {
        const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;

        const slashPath = `${commandKey}.description.slash`;
        const directPath = `${commandKey}.description`;

        const description = i18next.exists(slashPath, { lng: lang })
            ? i18next.t(slashPath, { lng: lang })
            : i18next.t(directPath, { lng: lang });

        if (description !== directPath && description !== slashPath) {
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
                const optionKey = `${commandKey}.options.${optionName}.description`;
                const oDescLocs: Record<string, string> = {};

                for (const lang of languages) {
                    const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;
                    const oDesc = i18next.t(optionKey, { lng: lang });

                    if (oDesc !== optionKey) {
                        oDescLocs[discordLocale] = oDesc;
                    }
                }
                option.setDescriptionLocalizations(oDescLocs);
            }
        });
    }

    return builder;
}
