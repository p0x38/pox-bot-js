import { AutocompleteInteraction, SlashCommandBuilder } from 'discord.js';
import { db } from '../../databases';
import { TFunction } from '@/i18n/fluent/t';
import { Command } from '../../types';
import i18n, { languages } from '../../i18n';
import { normalizeLangName } from '../../utils/langUtils';
import type { Context } from '@/contexts/Context';

const name = 'setlang';
const description = 'Change your display language.';

const setlang: Command = {
    name: name,
    description: description,
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
            await context.reply({
                content: t('common:errors.invalid_language'),
                ephemeral: true,
            });
            return;
        }

        await db.updateSetting(userId, { language: lang });

        const newT = i18n.getFixedT(lang);

        const successMessage = newT('common:lang_updated', {
            lang: normalizeLangName(lang),
        });

        await context.reply({
            content: successMessage,
            ephemeral: true,
        });
    },
};

export default setlang;
