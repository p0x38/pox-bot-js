import type { TFunction } from 'i18next';

import type { Context } from '@/contexts/Context';
import { NoPrivateMessage } from '@/errors/index';

import type { Command, Middleware } from '@/types';

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
