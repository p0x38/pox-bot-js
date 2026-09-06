import type { TFunction } from 'i18next';

import type { Context } from '@/contexts/Context';

import type { Command, Middleware } from '@/types';

const stats = new Map<string, { count: number; errors: number }>();

export const metrics: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
    next,
) => {
    const key = command.name;

    const data = stats.get(key) ?? { count: 0, errors: 0 };
    data.count++;

    try {
        await next();
    } catch (err) {
        data.errors++;
        throw err;
    } finally {
        stats.set(key, data);
    }
};
