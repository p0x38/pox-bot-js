import type { Context } from '@/contexts/Context';
import type { Command, Middleware } from '@/types';
import { MissingPermissions } from '@/errors/index';
import type { TFunction } from 'i18next';

export const permissions: Middleware = async (
    ctx: Context,
    command: Command,
    t: TFunction,
    next,
) => {
    if (!command.permissions) return next();

    const member = ctx.member;

    if (!member) {
        throw new MissingPermissions(command.permissions.map((p) => String(p)));
    }

    const missing = command.permissions.filter(
        (p) => !member.permissions.has(p),
    );

    if (missing.length > 0) {
        throw new MissingPermissions(missing.map((p) => String(p)));
    }

    await next();
};
