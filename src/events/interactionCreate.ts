import { Collection, Events, Interaction } from 'discord.js';

import runCommand from '@/application/runCommand';
import { Command } from '@/commands/types';

import { BotEvent } from './event';

const event: BotEvent<Events.InteractionCreate> = {
    name: Events.InteractionCreate,
    async execute(
        interaction: Interaction,
        commands: Collection<string, Command>,
    ) {
        if (interaction.isAutocomplete()) {
            const command = commands.get(interaction.commandName);
            if (command?.autocomplete) {
                await command.autocomplete(interaction);
            }
            return;
        }

        if (!interaction.isChatInputCommand()) return;

        const command = commands.get(interaction.commandName);
        if (!command) return;

        await runCommand(interaction, command, interaction.client.services);
    },
};

export default event;
