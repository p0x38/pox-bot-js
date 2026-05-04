import {
  db
} from "../../chunk-QR4SPJXM.js";
import "../../chunk-JINUGYJW.js";
import "../../chunk-LGWVEOJC.js";

// src/commands/statistics/leaderboard.ts
import { EmbedBuilder } from "discord.js";
var command = {
  name: "leaderboard",
  description: "Check the top XP earners in this server!",
  guildOnly: true,
  execute: async (context, t) => {
    const topUsers = await db.getTopUsers(10);
    if (!topUsers || topUsers.length === 0) {
      await context.reply({
        content: t("messages:commands.leaderboard.empty", {
          defaultValue: "No users found on the leaderboard yet!"
        })
      });
      return;
    }
    const embed = new EmbedBuilder().setTitle(t("commands:leaderboard.title", { defaultValue: "Global leaderboard" })).setColor(16705372).setDescription(
      topUsers.map((u, index) => {
        const rank = `**#${index + 1}**`;
        return `${rank} <@${u.user_id}> - **Lv.${u.level}** (\`${Number(u.xp).toLocaleString()} XP\`)`;
      }).join("\n\n")
    ).setTimestamp();
    await context.reply({ embeds: [embed] });
  }
};
var leaderboard_default = command;
export {
  leaderboard_default as default
};
