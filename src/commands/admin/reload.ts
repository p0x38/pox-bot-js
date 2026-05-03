import { Message, SlashCommandBuilder } from "discord.js";
import i18next, { TFunction } from "i18next";
import path from "node:path";
import logger from "../../logger";
import { readdirSync } from "node:fs";
import { Command, CommandContext, ParsedArgs } from "../../types";

const name = 'reload';
const description = 'Reloads commands.';

const reload: Command = {
    name: name,
    description: description,
    ownerOnly: true,
    data: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description),
    execute: async (message: CommandContext, t: TFunction, args: ParsedArgs) => {
        const rawTarget = (Array.isArray(args) ? args : args.target);
        const target = (typeof rawTarget === 'string') ? rawTarget.toLowerCase() : '';

        try {
            switch (target) {
                case 'lang':
                    await i18next.reloadResources();
                    await message.reply('Reloaded all translation resources!');
                    return;

                case 'command':
                    const rawCommandName = Array.isArray(args) ? args : args.name;
                    const commandName = (typeof rawCommandName === 'string') ? rawCommandName.toLowerCase() : '';
                    if (!commandName) {
                        await message.reply('Tell me which command you want to reload!');
                        return;
                    }

                    const command = (message.client as any).commands.get(commandName);
                    if (!command) {
                        await message.reply(`Command called '${commandName} doesn't exist!`);
                        return
                    }

                    const commandPath = path.join(__dirname, `./${commandName}.ts`);

                    delete require.cache[require.resolve(commandPath)];

                    const newCommand = require(commandPath);
                    (message.client as any).commands.set(newCommand.name, newCommand);

                    message.reply(`Reloaded '${commandName}' successfully!`);

                case 'all':
                    const commandsPath = path.join(__dirname, '../commands');
                    const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

                    for (const file of commandFiles) {
                        const filePath = path.resolve(commandsPath, file);

                        delete require.cache[require.resolve(filePath)];
                        const newCommand = require(filePath);

                        (message.client as any).commands.set(newCommand.name, newCommand);
                    }

                    message.reply(`Reloaded all ${commandFiles.length} commands!`);

                default:
                    message.reply('Usage: pox!lang, pox!command <command>, pox!all');
            }
        } catch (error) {
            logger.error('Reload failed:', error);
            message.reply('An error occurred while reloading.');
            return;
        }
    }
};

export default reload;