import type { Context } from '@/contexts/Context';
import type { Command, Middleware } from '@/types';
import { ArgumentParser } from '@/core/parser';
import type { TFunction } from 'i18next';

export const executeCommand: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
) => {
    const args = command.args
        ? await ArgumentParser.parse(ctx, command.args)
        : ({} as any);

    await command.execute(ctx, t, args);
};
