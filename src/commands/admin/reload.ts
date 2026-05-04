import { SlashCommandBuilder } from 'discord.js';
import { TFunction } from '@/i18n/fluent/t';
import i18next from 'i18next';
import path from 'node:path';
import logger from '../../logger';
import { readdirSync } from 'node:fs';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';

const name = 'reload';
const description = 'Reloads commands.';

const reload: Command = {
    name: name,
    description: description,
    ownerOnly: true,
    data: new SlashCommandBuilder().setName(name).setDescription(description),
    execute: async (message: Context, t: TFunction, args: any) => {
        const rawTarget = Array.isArray(args) ? args : args.target;
        const target =
            typeof rawTarget === 'string' ? rawTarget.toLowerCase() : '';

        try {
            switch (target) {
                case 'lang': {
                    await i18next.reloadResources();
                    await message.reply(
                        t('commands:reload.messages.lang_success'),
                    );
                    return;
                }

                case 'command': {
                    const rawCommandName = Array.isArray(args)
                        ? args
                        : args.name;
                    const commandName =
                        typeof rawCommandName === 'string'
                            ? rawCommandName.toLowerCase()
                            : '';
                    if (!commandName) {
                        await message.reply(
                            t('commands:reload.messages.missing_command'),
                        );
                        return;
                    }

                    const command = (message.client as any).commands.get(
                        commandName,
                    );
                    if (!command) {
                        await message.reply(
                            `Command called '${commandName} doesn't exist!`,
                        );
                        return;
                    }

                    const commandPath = path.join(
                        import.meta.dirname,
                        `./${commandName}.ts`,
                    );

                    const commandModule = await import(
                        `file://${commandPath}?update=${Date.now()}`
                    );
                    const newCommand = commandModule.default || commandModule;
                    (message.client as any).commands.set(
                        newCommand.name,
                        newCommand,
                    );

                    message.reply(`Reloaded '${commandName}' successfully!`);
                    return;
                }

                case 'all': {
                    const commandsPath = path.join(
                        import.meta.dirname,
                        '../commands',
                    );
                    const commandFiles = readdirSync(commandsPath).filter(
                        (file) => file.endsWith('.ts'),
                    );

                    for (const file of commandFiles) {
                        const filePath = path.resolve(commandsPath, file);

                        const commandModule = await import(
                            `file://${filePath}?update=${Date.now()}`
                        );
                        const newCommand =
                            commandModule.default || commandModule;

                        (message.client as any).commands.set(
                            newCommand.name,
                            newCommand,
                        );
                    }

                    message.reply(
                        `Reloaded all ${commandFiles.length} commands!`,
                    );
                    return;
                }

                default:
                    message.reply(
                        'Usage: pox!lang, pox!command <command>, pox!all',
                    );
            }
        } catch (error) {
            logger.error('Reload failed:', error);
            message.reply('An error occurred while reloading.');
            return;
        }
    },
};

export default reload;
