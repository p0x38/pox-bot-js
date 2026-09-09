import { EmbedBuilder } from 'discord.js';
import { TFunction } from 'i18next';

import type { Context } from '@/contexts/Context';

import { BotError } from './index';

export class ErrorHandler {
    static async handle(
        error: unknown,
        context: Context,
        t: TFunction<'errors'>,
        meta?: { command?: string },
    ) {
        const err = error instanceof Error ? error : new Error(String(error));

        context.services.logger.error('Command error:', {
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
            context.services.logger.error(
                'Failed to send error response:',
                replyError,
            );
        }
    }
}
