"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.profile = void 0;
const discord_js_1 = require("discord.js");
const database_1 = require("../../database");
const Experience_1 = require("../../utils/Experience");
const name = 'profile';
const description = 'Check user profile and level.';
exports.profile = {
    name: name,
    description: description,
    data: new discord_js_1.SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .addUserOption(opt => opt.setName(name)
        .setDescription(description)
        .setRequired(false)),
    args: [
        { name: 'target', type: 'member', required: false }
    ],
    execute: async (context, t, args) => {
        const executor = 'author' in context ? context.author : context.user;
        const executorMember = context.member;
        const target = args.target instanceof discord_js_1.GuildMember ? args.target : (executorMember || null);
        if (!target)
            return;
        const profileData = await database_1.db.getUserProfile(target.id);
        const roles = target.roles.cache
            .filter(r => r.id !== target.guild.id)
            .map(r => r.toString())
            .join(', ') || 'None';
        const createdAt = `<t:${Math.floor(target.user.createdTimestamp / 1000)}:R>`;
        const joinedAt = target.joinedTimestamp ? `<t:${Math.floor(target.joinedTimestamp / 1000)}:R>` : t('commands:profile.common.unknown');
        const xp = Number(profileData?.xp || 0);
        const progress = Experience_1.Experience.getLevelProgress(xp);
        const progressBar = Experience_1.Experience.getProgressBar(xp, 12);
        const infoEmbed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL() })
            .setTitle(`👤 ${t('commands:profile.pages.info_title')}`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0x5865F2)
            .addFields({ name: t('commands:profile.fields.name'), value: `\`${target.displayName}\``, inline: true }, { name: t('commands:profile.fields.id'), value: `\`${target.id}\``, inline: true }, { name: t('commands:profile.fields.created_at'), value: createdAt, inline: true }, { name: t('commands:profile.fields.joined_at'), value: joinedAt, inline: true }, { name: t('commands:profile.fields.roles'), value: roles });
        const statsEmbed = new discord_js_1.EmbedBuilder()
            .setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL() })
            .setTitle(`⭐ ${t('commands:profile.pages.stats_title')}`)
            .setThumbnail(target.displayAvatarURL())
            .setColor(0xFEE75C)
            .addFields({ name: t('commands:profile.fields.level'), value: `**Lv.${progress.level}**`, inline: true }, { name: t('commands:profile.fields.rank'), value: `**#${profileData?.global_rank || 'N/A'}**`, inline: true }, { name: t('commands:profile.fields.total_xp'), value: `\`${xp.toLocaleString()}\``, inline: true }, {
            name: `${t('commands:profile.fields.progress')} (${progress.percentage}%)`,
            value: `${progressBar}\n\`${progress.progressInLevel.toLocaleString()} / ${progress.neededInLevel.toLocaleString()} XP\``
        });
        const pages = [infoEmbed, statsEmbed];
        let currentPage = 0;
        const getRow = (page) => new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
            .setCustomId('prev')
            .setLabel(t('commands:profile.buttons.user_info'))
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(page === 0), new discord_js_1.ButtonBuilder()
            .setCustomId('next')
            .setLabel(t('commands:profile.buttons.level_stats'))
            .setStyle(discord_js_1.ButtonStyle.Secondary)
            .setDisabled(page === 1));
        const response = await context.reply({
            embeds: [pages[currentPage]],
            components: [getRow(currentPage)]
        });
        const message = 'author' in context
            ? response
            : await context.fetchReply();
        const collector = message.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000
        });
        collector.on('collect', async (i) => {
            if (i.user.id !== executor.id) {
                return i.reply({
                    content: t('commands:profile.messages.not_allowed'),
                    ephemeral: true
                });
            }
            currentPage = i.customId === 'next' ? 1 : 0;
            await i.update({
                embeds: [pages[currentPage]],
                components: [getRow(currentPage)]
            });
        });
        collector.on('end', () => {
            message.edit({ components: [] }).catch(() => null);
        });
    }
};
