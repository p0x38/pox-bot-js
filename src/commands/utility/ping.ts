import { TFunction } from '@/i18n/fluent/t';
import { Message } from 'discord.js';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';

const ping: Command = {
    name: 'ping',
    description: 'Retrieves bot latency.',
    guildOnly: false,

    execute: async (context: Context, t: TFunction) => {
        const latency = context.client.ws.ping;
        const msg = t('messages:commands.ping.success', { latency });

        if (context.raw instanceof Message) {
            await context.reply(msg);
        } else {
            await context.reply({ content: msg });
        }
    },
};

export default ping;
