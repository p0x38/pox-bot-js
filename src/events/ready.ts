import { Client, Collection, Events, REST, Routes } from 'discord.js';
import { BotEvent } from './event';
import { Command } from '../types';
import logger from '../logger';
import i18n from '../i18n';
import { localizeCommand } from '@/i18n/translator';

const event: BotEvent<Events.ClientReady> = {
    name: Events.ClientReady,
    once: true,
    async execute(client: Client, commands: Collection<string, Command>) {
        if (!i18n.isInitialized) {
            await new Promise((resolve) => i18n.on('initialized', resolve));
        }

        const slashData = Array.from(commands.values())
            .filter((cmd): cmd is Command & { data: any } => !!cmd.data)
            .map((cmd) => {
                const localized = localizeCommand(
                    cmd.data,
                    `commands:${cmd.name}`,
                );
                return localized.toJSON();
            });

        if (slashData.length > 0) {
            const rest = new REST({ version: '10' }).setToken(
                process.env.DISCORD_TOKEN!,
            );
            try {
                logger.info(
                    `Started refreshing ${slashData.length} application commands.`,
                );

                await rest.put(Routes.applicationCommands(client.user!.id), {
                    body: slashData,
                });

                logger.info(`Successfully reloaded application commands.`);
            } catch (error) {
                logger.error('Faield to deploy application commands:', error);
            }
        }

        logger.info(`${client.user?.tag} is ready!`);
        logger.info(`Loaded languages: ${i18n.languages.join(', ')}`);
    },
};

export default event;
