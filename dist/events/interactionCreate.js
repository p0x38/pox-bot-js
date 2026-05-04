import {
  runCommand_default
} from "../chunk-36TPF7Y6.js";
import {
  db
} from "../chunk-QR4SPJXM.js";
import "../chunk-MTF4G4PS.js";
import "../chunk-JINUGYJW.js";
import {
  logger_default
} from "../chunk-LGWVEOJC.js";

// src/events/interactionCreate.ts
import { Events } from "discord.js";
var event = {
  name: Events.InteractionCreate,
  async execute(interaction, commands) {
    if (interaction.isAutocomplete()) {
      const command2 = commands.get(interaction.commandName);
      if (command2?.autocomplete) {
        await command2.autocomplete(interaction).catch(logger_default.error);
      }
      return;
    }
    if (!interaction.isChatInputCommand()) return;
    const command = commands.get(interaction.commandName);
    if (!command) return;
    await db.getUserSettings(interaction.user.id);
    await runCommand_default(interaction, command);
  }
};
var interactionCreate_default = event;
export {
  interactionCreate_default as default
};
