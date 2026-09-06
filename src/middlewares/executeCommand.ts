import type { TFunction } from 'i18next';

import { ArgumentParser } from '@/application/parser';
import type { Command } from '@/commands/types';
import type { Context } from '@/contexts/Context';
import type { Middleware } from '@/types/middlewares';

export const executeCommand: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
) => {
    const args = command.args
        ? await ArgumentParser.parse(ctx, command.args)
        : {};

    const result = await command.execute(ctx, t, args);

    if (result) {
        let content = typeof result === 'string' ? result : result.content;

        if (typeof result !== 'string' && result.key) {
            content = t(result.key, result.vars);
        }

        if (typeof result !== 'string' && result.emotion) {
            ctx.emotion = result.emotion;
        }

        await ctx.reply({
            content,
            embeds: typeof result !== 'string' ? result.embeds : undefined,
            components:
                typeof result !== 'string' ? result.components : undefined,
            ephemeral:
                typeof result !== 'string' ? result.ephemeral : undefined,
        });
    }
};
