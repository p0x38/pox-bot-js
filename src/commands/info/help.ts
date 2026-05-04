import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ComponentType,
    SlashCommandBuilder,
} from 'discord.js';
import { Command } from '../../types';
import { HelpPagination } from '../../views/HelpView';
import type { Context } from '@/contexts/Context';

export const help: Command = {
    name: 'help',
    description: 'Shows a list of all available commands.',
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of all available commands.')
        .addIntegerOption((opt) =>
            opt.setName('page').setDescription('Page number'),
        ),

    execute: async (message: Context) => {
        const commandsArray = Array.from(
            (message.client as any).commands.values(),
        ) as Command<any>[];
        const helpView = new HelpPagination(commandsArray, 'PoxBot Help');

        let currentPage = 1;
        const maxPages = helpView.getPageCount();

        const getButtons = (page: number) => {
            return new ActionRowBuilder<ButtonBuilder>().addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('◀️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === 1),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('▶️')
                    .setStyle(ButtonStyle.Secondary)
                    .setDisabled(page === maxPages),
            );
        };

        const response = await message.reply({
            embeds: [helpView.getPage(currentPage)],
            components: maxPages > 1 ? [getButtons(currentPage)] : [],
        });

        if (maxPages <= 1 || !response) return;

        const collector = response.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000,
        });

        collector.on('collect', async (i) => {
            const userId =
                'author' in message ? message.user.id : message.user.id;
            if (i.user.id !== userId) {
                await i.reply({
                    content: 'Only the command user can flip pages.',
                    ephemeral: true,
                });
                return;
            }

            if (i.customId === 'prev') currentPage--;
            else if (i.customId === 'next') currentPage++;

            await i.update({
                embeds: [helpView.getPage(currentPage)],
                components: [getButtons(currentPage)],
            });
        });

        collector.on('end', () => {
            response.edit({ components: [] }).catch(() => {});
        });
    },
};

export default help;
