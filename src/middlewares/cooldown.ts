import type { TFunction } from 'i18next';

import type { Context } from '@/contexts/Context';

import type { Command, Middleware } from '@/types';

const cooldowns = new Map<string, number>();

const GLOBAL_COOLDOWN = 1500;

export const cooldown: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
    next,
) => {
    if (ctx.member?.permissions.has('Administrator')) {
        return next();
    }

    const commandKey = `${command.name}:${ctx.user.id}`;
    const globalKey = `global:${ctx.user.id}`;

    const now = Date.now();
    const commandCooldown = command.cooldown ?? 3000;

    const lastCommand = cooldowns.get(commandKey) ?? 0;
    const lastGlobal = cooldowns.get(globalKey) ?? 0;

    if (now - lastGlobal < GLOBAL_COOLDOWN) {
        const remaining = (
            (GLOBAL_COOLDOWN - (now - lastGlobal)) /
            1000
        ).toFixed(1);

        await ctx.reply({
            content: t('errors:cooldown.global', { time: remaining }),
            ephemeral: true,
        });
        return;
    }

    if (now - lastCommand < commandCooldown) {
        const remaining = (
            (commandCooldown - (now - lastCommand)) /
            1000
        ).toFixed(1);

        await ctx.reply({
            content: t('errors:cooldown.command', { time: remaining }),
            ephemeral: true,
        });
        return;
    }

    cooldowns.set(globalKey, now);
    cooldowns.set(commandKey, now);

    setTimeout(() => cooldowns.delete(globalKey), GLOBAL_COOLDOWN);
    setTimeout(() => cooldowns.delete(commandKey), commandCooldown);

    await next();
};
