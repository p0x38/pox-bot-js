"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.help = void 0;
const discord_js_1 = require("discord.js");
const HelpView_1 = require("../../views/HelpView");
exports.help = {
    name: 'help',
    description: 'Shows a list of all available commands.',
    data: new discord_js_1.SlashCommandBuilder()
        .setName('help')
        .setDescription('Shows a list of all available commands.')
        .addIntegerOption(opt => opt.setName('page').setDescription('Page number')),
    execute: async (message, t, args) => {
        const commandsArray = Array.from(message.client.commands.values());
        const helpView = new HelpView_1.HelpPagination(commandsArray, "PoxBot Help");
        let currentPage = 1;
        const maxPages = helpView.getPageCount();
        const getButtons = (page) => {
            return new discord_js_1.ActionRowBuilder().addComponents(new discord_js_1.ButtonBuilder()
                .setCustomId('prev')
                .setLabel('◀️')
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(page === 1), new discord_js_1.ButtonBuilder()
                .setCustomId('next')
                .setLabel('▶️')
                .setStyle(discord_js_1.ButtonStyle.Secondary)
                .setDisabled(page === maxPages));
        };
        const response = await message.reply({
            embeds: [helpView.getPage(currentPage)],
            components: maxPages > 1 ? [getButtons(currentPage)] : []
        });
        if (maxPages <= 1)
            return;
        const collector = response.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 60000
        });
        collector.on('collect', async (i) => {
            const userId = 'author' in message ? message.author.id : message.user.id;
            if (i.user.id !== userId) {
                await i.reply({ content: 'Only the command user can flip pages.', ephemeral: true });
                return;
            }
            if (i.customId === 'prev')
                currentPage--;
            else if (i.customId === 'next')
                currentPage++;
            await i.update({
                embeds: [helpView.getPage(currentPage)],
                components: [getButtons(currentPage)]
            });
        });
        collector.on('end', () => {
            response.edit({ components: [] }).catch(() => { });
        });
    }
};
exports.default = exports.help;
