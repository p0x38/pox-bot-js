import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js';

import type { Context } from '@/contexts/Context';
import { db } from '@/database';
import { TFunction } from '@/i18n/fluent/t';
import { Experience } from '@/services/experience.service';

import { Command } from '../types';

const name = 'profile';
const description = 'Check user profile and level.';

export const profile: Command<any> = {
    name: name,
    description: description,

    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption((opt) =>
            opt
                .setName('target')
                .setDescription('The user to view')
                .setRequired(false),
        ) as SlashCommandBuilder,

    args: [{ name: 'target', type: 'member', required: false }],

    execute: async (context: Context, t: TFunction, args: any) => {
        const executor =
            'author' in context.raw ? context.raw.author : context.user;
        const executorMember = context.member as GuildMember | null;

        const target =
            args.target instanceof GuildMember
                ? args.target
                : executorMember || null;

        if (!target) {
            return {
                content: 'Target member not found.',
                ephemeral: true,
            };
        }

        const profileData = (await db.getUserProfile(target.id))[0] as any;

        const roles =
            target.roles.cache
                .filter((r: any) => r.id !== target.guild.id)
                .map((r: any) => r.toString())
                .join(', ') || 'None';

        const createdAt = `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`;
        const joinedAt = target.joinedTimestamp
            ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`
            : t('profile-common-unknown');

        const xp = Number(profileData?.xp || 0);
        const progress = Experience.getLevelProgress(xp);
        const progressBar = Experience.getProgressBar(xp, 12);

        const infoEmbed = new EmbedBuilder()
            .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL(),
            })
            .setTitle(`👤 ${t('profile-pages-info-title')}`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0x5865f2)
            .addFields(
                {
                    name: t('profile-fields-name'),
                    value: `\`${target.displayName}\``,
                    inline: true,
                },
                {
                    name: t('profile-fields-id'),
                    value: `\`${target.id}\``,
                    inline: true,
                },
                {
                    name: t('profile-fields-created-at'),
                    value: createdAt,
                    inline: true,
                },
                {
                    name: t('profile-fields-joined-at'),
                    value: joinedAt,
                    inline: true,
                },
                { name: t('profile-fields-roles'), value: roles },
            );

        const statsEmbed = new EmbedBuilder()
            .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL(),
            })
            .setTitle(`⭐ ${t('profile-pages-stats-title')}`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0xfee75c)
            .addFields(
                {
                    name: t('profile-fields-level'),
                    value: `**Lv.${progress.level}**`,
                    inline: true,
                },
                {
                    name: t('profile-fields-rank'),
                    value: `**#${profileData?.global_rank || 'N/A'}**`,
                    inline: true,
                },
                {
                    name: t('profile-fields-total-xp'),
                    value: `\`${xp.toLocaleString()}\``,
                    inline: true,
                },
                {
                    name: `${t('profile-fields-progress', { level: progress.level + 1 })}`,
                    value: `${progressBar}\n\`${progress.progressInLevel.toLocaleString()} / ${progress.neededInLevel.toLocaleString()} XP\``,
                },
            );

        const pages = [infoEmbed, statsEmbed];
        let currentPage = 0;

        const getRow = (page: number) =>
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel(t('profile-buttons-user-info'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel(t('profile-buttons-level-stats'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
            );

        const response = await context.reply({
            embeds: [pages[currentPage]!],
            components: [getRow(currentPage)],
        });

        if (!response) return;

        const message =
            'author' in context.raw
                ? (response as any)
                : await (context.raw as any).fetchReply();

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
        });

        collector.on('collect', async (i: any) => {
            if (i.user.id !== (executor as any).id) {
                return i.reply({
                    content: t('profile-messages-not-allowed'),
                    ephemeral: true,
                });
            }

            currentPage = i.customId === 'next' ? 1 : 0;

            await i.update({
                embeds: [pages[currentPage]],
                components: [getRow(currentPage)],
            });
        });

        collector.on('end', () => {
            message.edit({ components: [] }).catch(() => null);
        });
    },
};

export default profile;
