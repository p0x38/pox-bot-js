import { ChatInputCommandInteraction, EmbedBuilder, Message } from "discord.js";
import { TFunction } from "i18next";
import { BotError } from "./error";
import logger from "../logger";

export class ErrorHandler {
    static async handle(error: any, context: Message | ChatInputCommandInteraction, t: TFunction<"errors">) {
        let displayMessage: string;

        logger.error(`An error raised:`, error);

        if (error instanceof BotError) {
            displayMessage = t(error.i18nKey, { ...error.args, returnObjects: false }) as string;
        } else {
            displayMessage = t('errors:unknown_error');
        }

        const embed = new EmbedBuilder()
            .setTitle('Error raised while handling command')
            .setDescription(displayMessage)
            .setColor('#ff4b4b');
        
            if (context instanceof Message) {
                if (context.channel.isTextBased()) await context.reply({ embeds: [embed] });
            } else {
                const replyOptions = { embeds: [embed], ephemeral: true };
                context.replied || context.deferred
                    ? await context.followUp(replyOptions)
                    : await context.reply(replyOptions);
            }
    }
}