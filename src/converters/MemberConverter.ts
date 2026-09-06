import { GuildMember } from 'discord.js';

import type { Context } from '@/contexts/Context';

import { BaseConverter, ConversionError } from './BaseConverter';

export class MemberConverter extends BaseConverter<GuildMember> {
    readonly name = 'Member';

    async convert(ctx: Context, value: string): Promise<GuildMember> {
        this.validateInput(value);

        if (!ctx.guild) {
            throw new ConversionError('error-guild-only-command');
        }

        const id = value.replace(/[<@!>]/g, '');

        if (!/^\d+$/.test(id)) {
            throw new ConversionError('error-invalid-member-format', {
                input: value,
            });
        }

        try {
            const member = await ctx.guild.members.fetch(id);

            if (!member) {
                throw new ConversionError('error-member-not-found', { id });
            }

            return member;
        } catch (_error) {
            throw new ConversionError('error-member-not-found', {
                input: value,
            });
        }
    }
}
