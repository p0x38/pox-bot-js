import { Command, RawContext } from '../types';
import { ErrorHandler } from '@/errors/handler';
import { Context } from '@/contexts/Context';
import { commandPipeline } from '@/middlewares/index';
import { createT } from '@/i18n/fluent/createT';
import { db } from '@/databases/index';
import { Message } from 'discord.js';
import { commandTracker } from '@/services/commandTracker.service';

export default async function (rawContext: RawContext, command: Command) {
    const userId =
        rawContext instanceof Message
            ? rawContext.author.id
            : rawContext.user.id;
    const settings = await db.getUserSettings(userId);
    const guildSettings = rawContext.guildId
        ? await db.getGuildSettings(rawContext.guildId)
        : null;

    const repeatCount = commandTracker.recordAndGetCount(userId, command.name);

    const ctx = new Context(
        rawContext,
        settings?.language,
        guildSettings?.personality,
        guildSettings?.emotion,
        repeatCount,
    );

    // Repetition fatigue logic
    if (repeatCount >= 5) {
        ctx.emotion = 'frustration';
    } else if (repeatCount >= 3) {
        ctx.emotion = 'annoyed';
    }

    const t = createT(ctx) as any;

    try {
        await commandPipeline(ctx, command, t);

        // Auto-emotion for success
        if (ctx.emotion === 'happy' || ctx.emotion === 'neutral') {
            ctx.emotion = 'joy';
        }
    } catch (error) {
        // Auto-emotion for errors
        ctx.emotion = 'frustration';

        await ErrorHandler.handle(error, ctx, t, {
            command: command.name,
        });
    }
}
