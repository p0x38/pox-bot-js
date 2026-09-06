import type { Context } from '@/contexts/Context';

import { Command } from '../types';

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
