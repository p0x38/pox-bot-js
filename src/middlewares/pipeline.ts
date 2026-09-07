import type { TFunction } from 'i18next';

import type { Command } from '@/commands/types';
import type { Context } from '@/contexts/Context';

import type { Middleware } from './types';

export function createPipeline(middlewares: Middleware[]) {
    return async function run(ctx: Context, command: Command, t: TFunction) {
        let index = -1;

        async function dispatch(i: number): Promise<void> {
            if (i <= index) {
                throw new Error('next() called multiple times');
            }

            index = i;

            const fn = middlewares[i];
            if (!fn) return;

            await fn(ctx, command, t, () => dispatch(i + 1));
        }

        await dispatch(0);
    };
}
