import { AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { db } from '../../databases';
import { TFunction } from '@/i18n/fluent/t';
import { Command } from '../../types';
import i18n, { languages } from '../../i18n';
import { normalizeLangName } from '../../utils/langUtils';
import type { Context } from '@/contexts/Context';

const name = 'setlang';
const description = 'Change your display language.';
const args = [
    {
        name: 'language',
        type: 'string',
        required: true,
    },
] as const;

const setlang: Command<typeof args> = {
    name: name,
    description: description,
    args: args,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption((option) =>
            option
                .setName('language')
                .setDescription('Select the language to set')
                .setRequired(true)
                .setAutocomplete(true),
        ),
    autocomplete: async (interaction: AutocompleteInteraction) => {
        const focusedValue = interaction.options.getFocused().toLowerCase();

        const choices = languages
            .filter((lang) => lang !== 'cimode')
            .map((lang) => ({
                name: `${normalizeLangName(lang)} (${lang.toUpperCase()})`,
                value: lang,
            }));

        const filtered = choices
            .filter(
                (choice) =>
                    choice.name.toLowerCase().includes(focusedValue) ||
                    choice.value.toLowerCase().includes(focusedValue),
            )
            .slice(0, 25);

        await interaction.respond(filtered);
    },
    execute: async (context: Context, t: TFunction, args: any) => {
        const lang = args.language as string;
        const userId = context.user.id;

        if (!languages.includes(lang)) {
            return {
                key: 'common-errors-invalid-language',
                ephemeral: true,
            };
        }

        await db.updateSetting(userId, { language: lang });

        const newT = i18n.getFixedT(lang);

        return {
            content: newT('common-lang-updated', {
                lang: normalizeLangName(lang),
            }),
            ephemeral: true,
            emotion: 'joy',
        };
    },
};

export default setlang;
