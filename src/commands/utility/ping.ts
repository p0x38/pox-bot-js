import { TFunction } from '@/i18n/fluent/t';
import { Message } from 'discord.js';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';

const ping: Command = {
    name: 'ping',
    description: 'Retrieves bot latency.',
    guildOnly: false,

    execute: async (context: Context) => {
        const latency = context.client.ws.ping;
        return {
            key: 'commands-ping-success',
            vars: { latency },
            emotion: 'joy',
        };
    },
};

export default ping;
