import type { TFunction } from 'i18next';

import type { Context } from '@/contexts/Context';
import logger from '@/logger';

import type { Command, Middleware } from '@/types';

export const logging: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
    next,
) => {
    const start = performance.now();

    try {
        await next();
    } finally {
        const duration = performance.now() - start;

        const base = {
            command: command.name,
            user: ctx.user.id,
            guild: ctx.guild?.id ?? 'DM',
            duration: Math.round(duration),
        };

        if (duration > 2000) {
            logger.warn('Slow command', base);
        } else {
            logger.info('Command executed', base);
        }
    }
};
