import {
  db
} from "../../chunk-QR4SPJXM.js";
import {
  localizeCommand
} from "../../chunk-6BZ3FAPP.js";
import "../../chunk-MTF4G4PS.js";
import "../../chunk-JINUGYJW.js";
import "../../chunk-LGWVEOJC.js";

// src/commands/statistics/profile.ts
import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
var name = "profile";
var description = "Show your level and progress.";
var command = {
  name,
  description,
  data: localizeCommand(
    new SlashCommandBuilder().setName(name).setDescription(description).addUserOption(
      (option) => option.setName("target").setDescription("The user to view").setRequired(false)
    ),
    "commands.profile"
  ),
  execute: async (context, t) => {
    const targetUser = "author" in context.raw ? context.raw.author : context.options?.getUser("target") || context.user;
    const profileData = await db.getUserProfile(targetUser.id);
    const profile = profileData[0] || {
      xp: 0,
      level: 1,
      xp_to_next: 50,
      progress_percent: 0,
      global_rank: "?"
    };
    const barLength = 10;
    const filled = Math.round(barLength * (profile.progress_percent || 0) / 100);
    const progressBar = "#".repeat(filled) + " ".repeat(barLength - filled);
    const xpNeeded = Number(profile.xp_to_next);
    const needXpText = t("commands:profile.messages.need_xp", {
      count: xpNeeded,
      amount: xpNeeded.toLocaleString()
    });
    const embed = new EmbedBuilder().setAuthor({ name: targetUser.username, iconURL: targetUser.displayAvatarURL() }).setTitle(t("commands:profile.embeds.main.title", { defaultValue: "User Profile" })).setColor(5793266).addFields(
      {
        name: t("commands:profile.embeds.main.fields.level"),
        value: `**${profile.level}**`,
        inline: true
      },
      {
        name: t("commands:profile.embeds.main.fields.rank"),
        value: `**#${profile.global_rank}**`,
        inline: true
      },
      {
        name: t("commands:profile.embeds.main.fields.xp"),
        value: `\`${Number(profile.xp).toLocaleString()} XP\``,
        inline: true
      },
      {
        name: t("commands:profile.embeds.main.fields.progress", {
          level: Number(profile.level) + 1
        }),
        value: `${progressBar} **${profile.progress_percent}%**
(${needXpText})`,
        inline: false
      }
    ).setTimestamp();
    await context.reply({ embeds: [embed] });
  }
};
var profile_default = command;
export {
  profile_default as default
};
