import type { Context } from '@/contexts/Context';
import type { User } from 'discord.js';
import { BaseConverter } from './BaseConverter';

export class UserConverter extends BaseConverter<User | null> {
    readonly name = 'User';

    async convert(ctx: Context, value: string): Promise<User | null> {
        if (!value) return null;

        const mentionMatch = value.match(/^<@!?(\d+)>$/);
        const idMatch = value.match(/^\d{17,20}$/);

        const id = mentionMatch?.[0] ?? idMatch?.[0];

        if (id) {
            try {
                return await ctx.client.users.fetch(id);
            } catch {
                return null;
            }
        }

        const lower = value.toLowerCase();
        const found = ctx.guild?.members.cache.find((m) =>
            m.user.username.toLowerCase().includes(lower),
        );

        return found?.user ?? null;
    }
}
