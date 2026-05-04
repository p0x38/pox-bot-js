import { Collection, Events, Message } from 'discord.js';
import { BotEvent } from './event';
import { Command } from '../types';
import { db } from '../databases';
import config from '../config.json';
import logger from '../logger';
import runCommand from '../core/runCommand';
import i18next from 'i18next';
import * as xpService from '../services/xpService';

const event: BotEvent<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message: Message, commands: Collection<string, Command>) {
        if (message.author.bot) return;

        const userSettings = await db.getUserSettings(message.author.id);
        const lang = userSettings.language || 'en';
        const t = i18next.getFixedT(lang);

        const isCommand = message.content.startsWith(config.bot_prefix);

        if (!isCommand) {
            try {
                const result = await xpService.handleMessage(message);

                if (result?.leveledUp) {
                    await message.reply(
                        t('common:messages.levelup', {
                            level: result.newLevel,
                        }),
                    );
                }
            } catch (err) {
                logger.error('XP system failed:', err);
            }
        }

        if (!isCommand) return;

        const args = message.content
            .slice(config.bot_prefix.length)
            .trim()
            .split(/\s+/);

        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const command = commands.get(commandName);
        if (!command) return;

        try {
            await runCommand(message, command);
        } catch (err) {
            logger.error(`Command execution failed for ${commandName}:`, err);
        }
    },
};

export default event;
