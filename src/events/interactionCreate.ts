import { Collection, Events, Interaction } from 'discord.js';
import { BotEvent } from './event';
import { Command } from '../types';
import logger from '../logger';
import { db } from '../databases';
import runCommand from '../core/runCommand';

const event: BotEvent<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    async execute(
        interaction: Interaction,
        commands: Collection<string, Command>,
    ) {
        if (interaction.isAutocomplete()) {
            const command = commands.get(interaction.commandName);
            if (command?.autocomplete) {
                await command.autocomplete(interaction).catch(logger.error);
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;

        await db.getUserSettings(interaction.user.id);
        // const t = i18n.getFixedT(userData.language || config.defaultLanguage); // Unused, runCommand handles it

        await runCommand(interaction, command);
    },
};

export default event;
