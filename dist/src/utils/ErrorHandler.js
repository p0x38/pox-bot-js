"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const discord_js_1 = require("discord.js");
const error_1 = require("./error");
const logger_1 = __importDefault(require("../logger"));
class ErrorHandler {
    static async handle(error, context, t) {
        let displayMessage;
        logger_1.default.error(`An error raised:`, error);
        if (error instanceof error_1.BotError) {
            displayMessage = t(error.i18nKey, { ...error.args, returnObjects: false });
        }
        else {
            displayMessage = t('errors:unknown_error');
        }
        const embed = new discord_js_1.EmbedBuilder()
            .setTitle('Error raised while handling command')
            .setDescription(displayMessage)
            .setColor('#ff4b4b');
        if (context instanceof discord_js_1.Message) {
            if (context.channel.isTextBased())
                await context.reply({ embeds: [embed] });
        }
        else {
            const replyOptions = { embeds: [embed], ephemeral: true };
            context.replied || context.deferred
                ? await context.followUp(replyOptions)
                : await context.reply(replyOptions);
        }
    }
}
exports.ErrorHandler = ErrorHandler;
