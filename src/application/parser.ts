import { Message } from 'discord.js';

import { ArgumentDefinition, type InferArgs } from '@/commands/types';
import type { Context } from '@/contexts/Context';
import { getConvertedValue } from '@/converters';
import { MissingRequiredArgument } from '@/errors/index';

export class ArgumentParser {
    static async getContextualT(context: Context) {
        const userId = context.user.id;
        const userData = await context.services.db.getUserSettings(userId);
        const lang = userData.language || context.config.defaultLanguage;

        return context.services.i18n.getFixedT(lang);
    }

    static async parse<T extends readonly ArgumentDefinition[]>(
        ctx: Context,
        defs: T,
    ): Promise<InferArgs<T>> {
        const result: Record<string, unknown> = {};

        for (const def of defs) {
            let rawValue: any;

            if (ctx.interaction) {
                const option = ctx.interaction.options.get(def.name);
                rawValue = option?.value ?? option?.user ?? option?.member;
            } else if (ctx.raw instanceof Message) {
                const args = ctx.raw.content.split(/\s+/).slice(1);
                rawValue = args[defs.indexOf(def)];
            }

            if (def.required && (rawValue === undefined || rawValue === null)) {
                throw new MissingRequiredArgument(def.name);
            }

            if (typeof rawValue === 'string') {
                result[def.name] = await getConvertedValue(
                    def.type,
                    ctx,
                    rawValue,
                );
            } else {
                result[def.name] = rawValue;
            }
        }

        return result as InferArgs<T>;
    }
}
