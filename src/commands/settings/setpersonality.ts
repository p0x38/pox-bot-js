import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { db } from '../../databases';
import { TFunction } from '@/i18n/fluent/t';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';
import { personalityPresets } from '@/i18n/context/presets';

const name = 'setpersonality';
const description = "Change the bot's personality for this server.";
const argsDef = [
    {
        name: 'preset',
        type: 'string',
        required: true,
    },
] as const;

const setpersonality: Command<typeof argsDef> = {
    name: name,
    description: description,
    args: argsDef,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption((option) =>
            option
                .setName('preset')
                .setDescription('Select the personality preset')
                .setRequired(true)
                .addChoices(
                    { name: 'Casual (Default)', value: 'casual' },
                    { name: 'Assistant (Formal)', value: 'assistant' },
                    { name: 'Silly :3', value: 'silly' },
                    { name: 'Gremlin (Chaotic)', value: 'gremlin' },
                    { name: 'Robotic', value: 'robotic' },
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (context: Context, t: TFunction, args) => {
        if (!context.guild) {
            return {
                content: 'This command can only be used in a server.',
                ephemeral: true,
            };
        }

        const presetKey = args.preset as string;
        const personality =
            personalityPresets[presetKey] ?? personalityPresets.casual!;

        await db.updateGuildSetting(context.guild.id, { personality });

        return {
            content: `Bot personality has been set to **${presetKey}**! (Tone: ${personality.type}, Intensity: ${personality.intensity})`,
            ephemeral: true,
        };
    },
};

export default setpersonality;
