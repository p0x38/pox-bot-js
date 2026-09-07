import type { TFunction } from 'i18next';

import type { Command } from '@/commands/types';
import config from '@/config.json';
import type { Context } from '@/contexts/Context';
import { NotOwner } from '@/errors/index';

import type { Middleware } from './types';

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
