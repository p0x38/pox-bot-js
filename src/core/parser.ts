import { Message } from 'discord.js';
import { MissingRequiredArgument } from '@/errors/index';
import { ArgumentDefinition, type InferArgs } from '../types';
import { CONVERTER_MAP, getConvertedValue } from '@/converters';
import { db } from '../databases';
import i18n from '../i18n';
import config from '../config.json';
import type { Context } from '@/contexts/Context';

export class ArgumentParser {
    static async getContextualT(context: Context) {
        const userId =
            context instanceof Message ? context.author.id : context.user.id;

        const userData = await db.getUserSettings(userId);
        const lang = userData.language || config.defaultLanguage;

        return i18n.getFixedT(lang);
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
