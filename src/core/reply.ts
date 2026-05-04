import type { Context } from '@/contexts/Context';
import {
    Message,
    MessageFlags,
    type InteractionReplyOptions,
    type MessageCreateOptions,
} from 'discord.js';

type ReplyOptions = {
    content?: string;
    embeds?: InteractionReplyOptions['embeds'];
    ephemeral?: boolean;
    deleteAfter?: number;
    edit?: boolean;
};

export async function reply(context: Context, options: ReplyOptions) {
    const { content, embeds, ephemeral, deleteAfter } = options;

    if (context.raw instanceof Message) {
        const msgOptions: MessageCreateOptions = {
            content,
            embeds,
        };

        const sent = await context.reply(msgOptions);

        if (deleteAfter) {
            safeDelete(sent, deleteAfter);
        }

        return sent;
    }

    const interactionOptions: InteractionReplyOptions = {
        content,
        embeds,
    };

    if (ephemeral) {
        interactionOptions.flags = MessageFlags.Ephemeral;
    }

    const sent = await context.reply({
        content,
        embeds,
        ephemeral,
        deleteAfter,
    });

    return sent;
}

function safeDelete(message: any, delay: number) {
    setTimeout(() => {
        if ('delete' in message) {
            message.delete().catch(() => {});
        }
    }, delay);
}
