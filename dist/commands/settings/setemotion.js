import {
  db
} from "../../chunk-QR4SPJXM.js";
import "../../chunk-JINUGYJW.js";
import "../../chunk-LGWVEOJC.js";

// src/commands/settings/setemotion.ts
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
var name = "setemotion";
var description = "Change the bot's emotion for this server.";
var setemotion = {
  name,
  description,
  data: new SlashCommandBuilder().setName(name).setDescription(description).addStringOption(
    (option) => option.setName("emotion").setDescription("Select the emotion to set").setRequired(true).addChoices(
      { name: "Happy", value: "happy" },
      { name: "Joy", value: "joy" },
      { name: "Fun", value: "fun" },
      { name: "Excited", value: "excited" },
      { name: "Interested", value: "interested" },
      { name: "Neutral", value: "neutral" },
      { name: "Sad", value: "sad" },
      { name: "Annoyed", value: "annoyed" },
      { name: "Frustration", value: "frustration" },
      { name: "Angry", value: "angry" },
      { name: "Panic", value: "panic" }
    )
  ).setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  execute: async (context, t, args) => {
    if (!context.guild) {
      await context.reply({
        content: "This command can only be used in a server.",
        ephemeral: true
      });
      return;
    }
    const emotion = args.emotion;
    await db.updateGuildSetting(context.guild.id, { emotion });
    await context.reply({
      content: `Bot emotion has been set to **${emotion}**!`,
      ephemeral: true
    });
  }
};
var setemotion_default = setemotion;
export {
  setemotion_default as default
};
