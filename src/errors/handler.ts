import { EmbedBuilder } from 'discord.js';
import { TFunction } from 'i18next';
import { BotError } from './index';
import logger from '../logger';
import type { Context } from '@/contexts/Context';

export class ErrorHandler {
    static async handle(
        error: unknown,
        context: Context,
        t: TFunction<'errors'>,
        meta?: { command?: string },
    ) {
        const err = error instanceof Error ? error : new Error(String(error));

        logger.error('Command error:', {
            message: err.message,
            stack: err.stack,
            user: context.user.id,
            guild: context.guild?.id ?? 'DM',
            command: meta?.command,
        });

        let displayMessage: string;

        if (error instanceof BotError) {
            displayMessage = t(error.i18nKey, {
                ...error.args,
                returnObjects: false,
            }) as string;
        } else {
            displayMessage = t('errors:unknown_error');
        }

        const embed = new EmbedBuilder()
            .setTitle(t('errors:title'))
            .setDescription(displayMessage)
            .setColor(0xff4b4b)
            .setTimestamp();

        try {
            await context.reply({
                embeds: [embed],
                ephemeral: true,
            });
        } catch (replyError) {
            logger.error('Failed to send error response:', replyError);
        }
    }
}
