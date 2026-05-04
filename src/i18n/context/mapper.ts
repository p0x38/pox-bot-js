import type { Context } from '@/contexts/Context';
import type { I18nContext } from './types';

export function toI18nContext(ctx: Context): I18nContext {
    return {
        userId: ctx.user.id,
        guildId: ctx.guild?.id,
        locale: ctx.locale,

        isGuild: !!ctx.guild,
        isDM: !ctx.guild,

        hour: new Date().getHours(),
        isAdmin: ctx.isAdmin,
        isNewUser: false,
        command: ctx.command,

        personality: ctx.personality,
        emotion: ctx.emotion,
        streak: ctx.streak,
    };
}
