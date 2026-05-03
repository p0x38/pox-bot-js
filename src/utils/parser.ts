import { ChatInputCommandInteraction, GuildMember, Message } from "discord.js";
import { MissingRequiredArgument } from "./error";
import { ArgumentDefinition, CommandContext, ParsedArgs } from "../types";
import { CONVERTER_MAP } from "./converters";
import { db } from "../database";
import i18n from '../i18n';
import config from "../../config.json";

export class ArgumentParser {
    static async getContextualT(context: CommandContext) {
        const userId = context instanceof Message ? context.author.id : context.user.id;

        const userData = await db.getUserSettings(userId);
        const lang = userData.language || config.defaultLanguage;

        return i18n.getFixedT(lang);
    }
    static async parse(context: CommandContext, argDefs: ArgumentDefinition[]): Promise<ParsedArgs> {
        const parsedArgs: ParsedArgs = {};

        if (context instanceof ChatInputCommandInteraction) {
            for (const def of argDefs) {
                const option = context.options.get(def.name);
                if (def.required && !option) throw new MissingRequiredArgument(def.name);
                parsedArgs[def.name] = this.extractOptionValue(option);
            }
        } else {
            const args = context.content.split(/\s+/).slice(1);

            for (let i = 0; i < argDefs.length; i++) {
                const def = argDefs[i];
                const rawValue = args[i];

                if (def.required && !rawValue) throw new MissingRequiredArgument(def.name);

                parsedArgs[def.name] = await this.parseRawString(context, rawValue, def.type);
            }
        }

        return parsedArgs;
    }

    private static extractOptionValue(option: any) {
        if (!option) return undefined;
        return option.member ?? option.user ?? option.value;
    }

    private static async parseRawString(message: Message, value: string, type: string) {
        if (!value) return undefined;

        const ConverterClass = CONVERTER_MAP[type];

        if (ConverterClass) {
            return await ConverterClass.convert(message, value);
        }

        if (type === 'number') return Number(value);
        if (type === 'boolean') return ['true', 'yes', 'on'].includes(value.toLowerCase());

        return value;
    }
}