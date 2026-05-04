import {
  logger_default
} from "../../chunk-LGWVEOJC.js";

// src/commands/admin/reload.ts
import { SlashCommandBuilder } from "discord.js";
import i18next from "i18next";
import path from "path";
import { readdirSync } from "fs";
var name = "reload";
var description = "Reloads commands.";
var reload = {
  name,
  description,
  ownerOnly: true,
  data: new SlashCommandBuilder().setName(name).setDescription(description),
  execute: async (message, t, args) => {
    const rawTarget = Array.isArray(args) ? args : args.target;
    const target = typeof rawTarget === "string" ? rawTarget.toLowerCase() : "";
    try {
      switch (target) {
        case "lang": {
          await i18next.reloadResources();
          await message.reply(t("commands:reload.messages.lang_success"));
          return;
        }
        case "command": {
          const rawCommandName = Array.isArray(args) ? args : args.name;
          const commandName = typeof rawCommandName === "string" ? rawCommandName.toLowerCase() : "";
          if (!commandName) {
            await message.reply(t("commands:reload.messages.missing_command"));
            return;
          }
          const command = message.client.commands.get(commandName);
          if (!command) {
            await message.reply(`Command called '${commandName} doesn't exist!`);
            return;
          }
          const commandPath = path.join(import.meta.dirname, `./${commandName}.ts`);
          const commandModule = await import(`file://${commandPath}?update=${Date.now()}`);
          const newCommand = commandModule.default || commandModule;
          message.client.commands.set(newCommand.name, newCommand);
          message.reply(`Reloaded '${commandName}' successfully!`);
          return;
        }
        case "all": {
          const commandsPath = path.join(import.meta.dirname, "../commands");
          const commandFiles = readdirSync(commandsPath).filter(
            (file) => file.endsWith(".ts")
          );
          for (const file of commandFiles) {
            const filePath = path.resolve(commandsPath, file);
            const commandModule = await import(`file://${filePath}?update=${Date.now()}`);
            const newCommand = commandModule.default || commandModule;
            message.client.commands.set(newCommand.name, newCommand);
          }
          message.reply(`Reloaded all ${commandFiles.length} commands!`);
          return;
        }
        default:
          message.reply("Usage: pox!lang, pox!command <command>, pox!all");
      }
    } catch (error) {
      logger_default.error("Reload failed:", error);
      message.reply("An error occurred while reloading.");
      return;
    }
  }
};
var reload_default = reload;
export {
  reload_default as default
};
