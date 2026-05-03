"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const i18next_1 = __importDefault(require("i18next"));
const node_path_1 = __importDefault(require("node:path"));
const logger_1 = __importDefault(require("../../logger"));
const node_fs_1 = require("node:fs");
const name = 'reload';
const description = 'Reloads commands.';
const reload = {
    name: name,
    description: description,
    ownerOnly: true,
    data: new discord_js_1.SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    execute: async (message, t, args) => {
        const rawTarget = (Array.isArray(args) ? args : args.target);
        const target = (typeof rawTarget === 'string') ? rawTarget.toLowerCase() : '';
        try {
            switch (target) {
                case 'lang':
                    await i18next_1.default.reloadResources();
                    await message.reply('Reloaded all translation resources!');
                    return;
                case 'command':
                    const rawCommandName = Array.isArray(args) ? args : args.name;
                    const commandName = (typeof rawCommandName === 'string') ? rawCommandName.toLowerCase() : '';
                    if (!commandName) {
                        await message.reply('Tell me which command you want to reload!');
                        return;
                    }
                    const command = message.client.commands.get(commandName);
                    if (!command) {
                        await message.reply(`Command called '${commandName} doesn't exist!`);
                        return;
                    }
                    const commandPath = node_path_1.default.join(__dirname, `./${commandName}.ts`);
                    delete require.cache[require.resolve(commandPath)];
                    const newCommand = require(commandPath);
                    message.client.commands.set(newCommand.name, newCommand);
                    message.reply(`Reloaded '${commandName}' successfully!`);
                case 'all':
                    const commandsPath = node_path_1.default.join(__dirname, '../commands');
                    const commandFiles = (0, node_fs_1.readdirSync)(commandsPath).filter(file => file.endsWith('.ts'));
                    for (const file of commandFiles) {
                        const filePath = node_path_1.default.resolve(commandsPath, file);
                        delete require.cache[require.resolve(filePath)];
                        const newCommand = require(filePath);
                        message.client.commands.set(newCommand.name, newCommand);
                    }
                    message.reply(`Reloaded all ${commandFiles.length} commands!`);
                default:
                    message.reply('Usage: pox!lang, pox!command <command>, pox!all');
            }
        }
        catch (error) {
            logger_1.default.error('Reload failed:', error);
            message.reply('An error occurred while reloading.');
            return;
        }
    }
};
exports.default = reload;
