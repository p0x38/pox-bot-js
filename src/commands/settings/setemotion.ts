import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

import type { Context } from '@/contexts/Context';
import { db } from '@/database';
import { EmotionType } from '@/i18n/context/types';
import { TFunction } from '@/i18n/fluent/t';

import { Command } from '../types';

const name = 'setemotion';
const description = "Change the bot's emotion for this server.";
const args = [
    {
        name: 'emotion',
        type: 'string',
        required: true,
    },
] as const;

const setemotion: Command<typeof args> = {
    name: name,
    description: description,
    args: args,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addStringOption((option) =>
            option
                .setName('emotion')
                .setDescription('Select the emotion to set')
                .setRequired(true)
                .addChoices(
                    { name: 'Happy', value: 'happy' },
                    { name: 'Joy', value: 'joy' },
                    { name: 'Fun', value: 'fun' },
                    { name: 'Excited', value: 'excited' },
                    { name: 'Interested', value: 'interested' },
                    { name: 'Neutral', value: 'neutral' },
                    { name: 'Sad', value: 'sad' },
                    { name: 'Annoyed', value: 'annoyed' },
                    { name: 'Frustration', value: 'frustration' },
                    { name: 'Angry', value: 'angry' },
                    { name: 'Panic', value: 'panic' },
                ),
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    execute: async (context: Context, t: TFunction, args: any) => {
        if (!context.guild) {
            return {
                content: 'This command can only be used in a server.',
                ephemeral: true,
            };
        }

        const emotion = args.emotion as EmotionType;
        await db.updateGuildSetting(context.guild.id, { emotion });

        return {
            content: `Bot emotion has been set to **${emotion}**!`,
            ephemeral: true,
            emotion: emotion,
        };
    },
};

export default setemotion;
