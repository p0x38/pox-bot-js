import type { Context } from '@/contexts/Context';
import type { Command, Middleware } from '@/types';
import type { TFunction } from 'i18next';
import config from '@/config.json';
import { NotOwner } from '@/errors/index';

export const ownerOnly: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
    next,
) => {
    if (!command.ownerOnly) return next();

    if (ctx.user.id !== config.ownerId) {
        throw new NotOwner();
    }

    await next();
};
