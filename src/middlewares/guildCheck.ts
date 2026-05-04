import type { Context } from '@/contexts/Context';
import type { Command, Middleware } from '@/types';
import type { TFunction } from 'i18next';
import { NoPrivateMessage } from '@/errors/index';

export const guildOnly: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
    next,
) => {
    if (!command.guildOnly) return next();

    if (!ctx.guild) {
        throw new NoPrivateMessage();
    }

    await next();
};
