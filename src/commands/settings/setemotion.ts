import { PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { db } from '../../databases';
import { TFunction } from '@/i18n/fluent/t';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';
import { EmotionType } from '@/i18n/context/types';

const name = 'setemotion';
const description = "Change the bot's emotion for this server.";

const setemotion: Command = {
    name: name,
    description: description,
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
            await context.reply({
                content: 'This command can only be used in a server.',
                ephemeral: true,
            });
            return;
        }

        const emotion = args.emotion as EmotionType;
        await db.updateGuildSetting(context.guild.id, { emotion });

        await context.reply({
            content: `Bot emotion has been set to **${emotion}**!`,
            ephemeral: true,
        });
    },
};

export default setemotion;
