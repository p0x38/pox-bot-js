"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArgumentParser = void 0;
const discord_js_1 = require("discord.js");
const error_1 = require("./error");
const converters_1 = require("./converters");
const database_1 = require("../database");
const i18n_1 = __importDefault(require("../i18n"));
const config_json_1 = __importDefault(require("../../config.json"));
class ArgumentParser {
    static async getContextualT(context) {
        const userId = context instanceof discord_js_1.Message ? context.author.id : context.user.id;
        const userData = await database_1.db.getUserSettings(userId);
        const lang = userData.language || config_json_1.default.defaultLanguage;
        return i18n_1.default.getFixedT(lang);
    }
    static async parse(context, argDefs) {
        const parsedArgs = {};
        if (context instanceof discord_js_1.ChatInputCommandInteraction) {
            for (const def of argDefs) {
                const option = context.options.get(def.name);
                if (def.required && !option)
                    throw new error_1.MissingRequiredArgument(def.name);
                parsedArgs[def.name] = this.extractOptionValue(option);
            }
        }
        else {
            const args = context.content.split(/\s+/).slice(1);
            for (let i = 0; i < argDefs.length; i++) {
                const def = argDefs[i];
                const rawValue = args[i];
                if (def.required && !rawValue)
                    throw new error_1.MissingRequiredArgument(def.name);
                parsedArgs[def.name] = await this.parseRawString(context, rawValue, def.type);
            }
        }
        return parsedArgs;
    }
    static extractOptionValue(option) {
        if (!option)
            return undefined;
        return option.member ?? option.user ?? option.value;
    }
    static async parseRawString(message, value, type) {
        if (!value)
            return undefined;
        const ConverterClass = converters_1.CONVERTER_MAP[type];
        if (ConverterClass) {
            return await ConverterClass.convert(message, value);
        }
        if (type === 'number')
            return Number(value);
        if (type === 'boolean')
            return ['true', 'yes', 'on'].includes(value.toLowerCase());
        return value;
    }
}
exports.ArgumentParser = ArgumentParser;
