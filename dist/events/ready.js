import {
  localizeCommand
} from "../chunk-6BZ3FAPP.js";
import {
  i18n_default
} from "../chunk-MTF4G4PS.js";
import "../chunk-JINUGYJW.js";
import {
  logger_default
} from "../chunk-LGWVEOJC.js";

// src/events/ready.ts
import { Events, REST, Routes } from "discord.js";
var event = {
  name: Events.ClientReady,
  once: true,
  async execute(client, commands) {
    if (!i18n_default.isInitialized) {
      await new Promise((resolve) => i18n_default.on("initialized", resolve));
    }
    const slashData = Array.from(commands.values()).filter((cmd) => !!cmd.data).map((cmd) => {
      const localized = localizeCommand(cmd.data, `commands:${cmd.name}`);
      return localized.toJSON();
    });
    if (slashData.length > 0) {
      const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
      try {
        logger_default.info(`Started refreshing ${slashData.length} application commands.`);
        await rest.put(Routes.applicationCommands(client.user.id), { body: slashData });
        logger_default.info(`Successfully reloaded application commands.`);
      } catch (error) {
        logger_default.error("Faield to deploy application commands:", error);
      }
    }
    logger_default.info(`${client.user?.tag} is ready!`);
    logger_default.info(`Loaded languages: ${i18n_default.languages.join(", ")}`);
  }
};
var ready_default = event;
export {
  ready_default as default
};
