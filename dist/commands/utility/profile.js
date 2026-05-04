import {
  db
} from "../../chunk-QR4SPJXM.js";
import "../../chunk-JINUGYJW.js";
import "../../chunk-LGWVEOJC.js";

// src/commands/utility/profile.ts
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  EmbedBuilder,
  GuildMember,
  SlashCommandBuilder
} from "discord.js";

// src/utils/Experience.ts
var Experience = class {
  static CONSTANT = 50;
  static getLevel(xp) {
    if (xp <= 0) return 1;
    return Math.floor(Math.sqrt(xp / this.CONSTANT)) + 1;
  }
  static getXPForLevel(level) {
    if (level <= 1) return 0;
    const targetLevel = level - 1;
    return this.CONSTANT * (targetLevel * targetLevel);
  }
  static getLevelProgress(xp) {
    const level = this.getLevel(xp);
    const currentLevelStartXP = this.getXPForLevel(level);
    const nextLevelStartXP = this.getXPForLevel(level + 1);
    const progressInLevel = xp - currentLevelStartXP;
    const neededInLevel = nextLevelStartXP - currentLevelStartXP;
    const percentage = Math.min(Math.floor(progressInLevel / neededInLevel * 100), 100);
    return {
      level,
      progressInLevel,
      neededInLevel,
      percentage,
      totalXP: xp
    };
  }
  static getProgressBar(xp, length = 10) {
    const { percentage } = this.getLevelProgress(xp);
    const filledLength = Math.round(length * percentage / 100);
    const emptyLength = length - filledLength;
    return "#".repeat(filledLength) + " ".repeat(emptyLength);
  }
};

// src/commands/utility/profile.ts
var name = "profile";
var description = "Check user profile and level.";
var profile = {
  name,
  description,
  data: new SlashCommandBuilder().setName(name).setDescription(description).addUserOption(
    (opt) => opt.setName(name).setDescription(description).setRequired(false)
  ),
  args: [{ name: "target", type: "member", required: false }],
  execute: async (context, t, args) => {
    const executor = "author" in context.raw ? context.raw.author : context.user;
    const executorMember = context.member;
    const target = args.target instanceof GuildMember ? args.target : executorMember || null;
    if (!target) return;
    const profileData = await db.getUserProfile(target.id);
    const roles = target.roles.cache.filter((r) => r.id !== target.guild.id).map((r) => r.toString()).join(", ") || "None";
    const createdAt = `<t:${Math.floor(target.user.createdTimestamp / 1e3)}:R>`;
    const joinedAt = target.joinedTimestamp ? `<t:${Math.floor(target.joinedTimestamp / 1e3)}:R>` : t("commands:profile.common.unknown");
    const xp = Number(profileData?.xp || 0);
    const progress = Experience.getLevelProgress(xp);
    const progressBar = Experience.getProgressBar(xp, 12);
    const infoEmbed = new EmbedBuilder().setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL() }).setTitle(`\u{1F464} ${t("commands:profile.pages.info_title")}`).setThumbnail(target.displayAvatarURL()).setColor(5793266).addFields(
      {
        name: t("commands:profile.fields.name"),
        value: `\`${target.displayName}\``,
        inline: true
      },
      { name: t("commands:profile.fields.id"), value: `\`${target.id}\``, inline: true },
      { name: t("commands:profile.fields.created_at"), value: createdAt, inline: true },
      { name: t("commands:profile.fields.joined_at"), value: joinedAt, inline: true },
      { name: t("commands:profile.fields.roles"), value: roles }
    );
    const statsEmbed = new EmbedBuilder().setAuthor({ name: target.user.tag, iconURL: target.displayAvatarURL() }).setTitle(`\u2B50 ${t("commands:profile.pages.stats_title")}`).setThumbnail(target.displayAvatarURL()).setColor(16705372).addFields(
      {
        name: t("commands:profile.fields.level"),
        value: `**Lv.${progress.level}**`,
        inline: true
      },
      {
        name: t("commands:profile.fields.rank"),
        value: `**#${profileData?.global_rank || "N/A"}**`,
        inline: true
      },
      {
        name: t("commands:profile.fields.total_xp"),
        value: `\`${xp.toLocaleString()}\``,
        inline: true
      },
      {
        name: `${t("commands:profile.fields.progress")} (${progress.percentage}%)`,
        value: `${progressBar}
\`${progress.progressInLevel.toLocaleString()} / ${progress.neededInLevel.toLocaleString()} XP\``
      }
    );
    const pages = [infoEmbed, statsEmbed];
    let currentPage = 0;
    const getRow = (page) => new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("prev").setLabel(t("commands:profile.buttons.user_info")).setStyle(ButtonStyle.Secondary).setDisabled(page === 0),
      new ButtonBuilder().setCustomId("next").setLabel(t("commands:profile.buttons.level_stats")).setStyle(ButtonStyle.Secondary).setDisabled(page === 1)
    );
    const response = await context.reply({
      embeds: [pages[currentPage]],
      components: [getRow(currentPage)]
    });
    const message = "author" in context.raw ? response : await context.raw.fetchReply();
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 6e4
    });
    collector.on("collect", async (i) => {
      if (i.user.id !== executor.id) {
        return i.reply({
          content: t("commands:profile.messages.not_allowed"),
          ephemeral: true
        });
      }
      currentPage = i.customId === "next" ? 1 : 0;
      await i.update({
        embeds: [pages[currentPage]],
        components: [getRow(currentPage)]
      });
    });
    collector.on("end", () => {
      message.edit({ components: [] }).catch(() => null);
    });
  }
};
export {
  profile
};
