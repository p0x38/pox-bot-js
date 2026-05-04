import { SlashCommandBuilder } from 'discord.js';
import { TFunction } from '@/i18n/fluent/t';
import i18next from 'i18next';
import path from 'node:path';
import logger from '../../logger';
import { readdirSync } from 'node:fs';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';

import { clearCache } from '@/i18n/cache';

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
                    clearCache();
                    return { key: 'commands-reload-messages-lang-success' };
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
                        return {
                            key: 'commands-reload-messages-missing-command',
                        };
                    }

                    const command = (message.client as any).commands.get(
                        commandName,
                    );
                    if (!command) {
                        return {
                            content: `Command called '${commandName} doesn't exist!`,
                        };
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

                    return {
                        content: `Reloaded '${commandName}' successfully!`,
                    };
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

                    return {
                        content: `Reloaded all ${commandFiles.length} commands!`,
                    };
                }

                default:
                    return {
                        content:
                            'Usage: pox!lang, pox!command <command>, pox!all',
                    };
            }
        } catch (error) {
            logger.error('Reload failed:', error);
            return { content: 'An error occurred while reloading.' };
        }
    },
};

export default reload;
