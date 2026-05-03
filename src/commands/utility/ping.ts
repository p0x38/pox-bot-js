import { TFunction } from "i18next";
import { ChatInputCommandInteraction, Message, SlashCommandBuilder } from "discord.js";
import { Command, CommandContext, ParsedArgs } from "../../types";

const ping: Command = {
    name: 'ping',
    description: 'Retrieves bot latency.',
    guildOnly: false,

    execute: async (context: CommandContext, t: TFunction, args: ParsedArgs) => {
        const latency = context.client.ws.ping;
        const msg = t('messages:commands.ping.success', { latency });

        if (context instanceof Message) {
            await context.reply(msg);
        } else {
            await context.reply({ content: msg });
        }
    }
}

export default ping;