import { Message } from 'discord.js';
import type { Context } from '@/contexts/Context';

export async function universalReply(context: Context, options: string | any) {
    const payload = typeof options == 'string' ? { context: options } : options;

    if (context.raw instanceof Message) {
        return await context.reply(payload);
    } else {
        if (context.replied || context.deferred) {
            return await context.edit(payload);
        }
        return await context.reply(payload);
    }
}
