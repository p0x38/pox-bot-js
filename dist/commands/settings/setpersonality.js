import {
  db
} from "../../chunk-QR4SPJXM.js";
import "../../chunk-JINUGYJW.js";
import "../../chunk-LGWVEOJC.js";

// src/commands/settings/setpersonality.ts
import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";

// src/i18n/context/presets.ts
var personalityPresets = {
  neutral: {
    type: "neutral",
    intensity: "normal"
  },
  casual: {
    type: "casual",
    intensity: "normal"
  },
  assistant: {
    type: "formal",
    intensity: "high"
  },
  silly: {
    type: "silly",
    intensity: "high"
  },
  gremlin: {
    type: "chaotic",
    intensity: "high"
  },
  robotic: {
    type: "robotic",
    intensity: "low"
  }
};
var defaultPersonality = personalityPresets.casual;

// src/commands/settings/setpersonality.ts
var name = "setpersonality";
var description = "Change the bot's personality for this server.";
var setpersonality = {
  name,
  description,
  data: new SlashCommandBuilder().setName(name).setDescription(description).addStringOption(
    (option) => option.setName("preset").setDescription("Select the personality preset").setRequired(true).addChoices(
      { name: "Casual (Default)", value: "casual" },
      { name: "Assistant (Formal)", value: "assistant" },
      { name: "Silly :3", value: "silly" },
      { name: "Gremlin (Chaotic)", value: "gremlin" },
      { name: "Robotic", value: "robotic" }
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
    const presetKey = args.preset;
    const personality = personalityPresets[presetKey] ?? personalityPresets.casual;
    await db.updateGuildSetting(context.guild.id, { personality });
    await context.reply({
      content: `Bot personality has been set to **${presetKey}**! (Tone: ${personality.type}, Intensity: ${personality.intensity})`,
      ephemeral: true
    });
  }
};
var setpersonality_default = setpersonality;
export {
  setpersonality_default as default
};
