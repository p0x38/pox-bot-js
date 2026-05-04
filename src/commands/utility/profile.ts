import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder,
} from 'discord.js';
import { db } from '../../databases';
import { Command } from '../../types';
import { TFunction } from '@/i18n/fluent/t';
import { Experience } from '@/services/experience.service';
import type { Context } from '@/contexts/Context';

const name = 'profile';
const description = 'Check user profile and level.';

export const profile: Command<any> = {
    name: name,
    description: description,

    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption((opt) =>
            opt.setName(name).setDescription(description).setRequired(false),
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

        if (!target) return;

        const profileData = (await db.getUserProfile(target.id)) as any;

        const roles =
            target.roles.cache
                .filter((r: any) => r.id !== target.guild.id)
                .map((r: any) => r.toString())
                .join(', ') || 'None';

        const createdAt = `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`;
        const joinedAt = target.joinedTimestamp
            ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>`
            : t('commands:profile.common.unknown');

        const xp = Number(profileData?.xp || 0);
        const progress = Experience.getLevelProgress(xp);
        const progressBar = Experience.getProgressBar(xp, 12);

        const infoEmbed = new EmbedBuilder()
            .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL(),
            })
            .setTitle(`👤 ${t('commands:profile.pages.info_title')}`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0x5865f2)
            .addFields(
                {
                    name: t('commands:profile.fields.name'),
                    value: `\`${target.displayName}\``,
                    inline: true,
                },
                {
                    name: t('commands:profile.fields.id'),
                    value: `\`${target.id}\``,
                    inline: true,
                },
                {
                    name: t('commands:profile.fields.created_at'),
                    value: createdAt,
                    inline: true,
                },
                {
                    name: t('commands:profile.fields.joined_at'),
                    value: joinedAt,
                    inline: true,
                },
                { name: t('commands:profile.fields.roles'), value: roles },
            );

        const statsEmbed = new EmbedBuilder()
            .setAuthor({
                name: target.user.tag,
                iconURL: target.displayAvatarURL(),
            })
            .setTitle(`⭐ ${t('commands:profile.pages.stats_title')}`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0xfee75c)
            .addFields(
                {
                    name: t('commands:profile.fields.level'),
                    value: `**Lv.${progress.level}**`,
                    inline: true,
                },
                {
                    name: t('commands:profile.fields.rank'),
                    value: `**#${profileData?.global_rank || 'N/A'}**`,
                    inline: true,
                },
                {
                    name: t('commands:profile.fields.total_xp'),
                    value: `\`${xp.toLocaleString()}\``,
                    inline: true,
                },
                {
                    name: `${t('commands:profile.fields.progress')} (${progress.percentage}%)`,
                    value: `${progressBar}\n\`${progress.progressInLevel.toLocaleString()} / ${progress.neededInLevel.toLocaleString()} XP\``,
                },
            );

        const pages = [infoEmbed, statsEmbed];
        let currentPage = 0;

        const getRow = (page: number) =>
            new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel(t('commands:profile.buttons.user_info'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel(t('commands:profile.buttons.level_stats'))
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
            );

        const response = await context.reply({
            embeds: [pages[currentPage]!],
            components: [getRow(currentPage)],
        });

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
                    content: t('commands:profile.messages.not_allowed'),
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
