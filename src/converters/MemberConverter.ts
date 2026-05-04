import type { Context } from '@/contexts/Context';

export class MemberConverter {
    static async convert(ctx: Context, value: string) {
        const id = value.replace(/[<@!>]/g, '');

        if (!ctx.guild) return undefined;

        return ctx.guild.members.fetch(id).catch(() => undefined);
    }
}
