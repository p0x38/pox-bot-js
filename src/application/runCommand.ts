import { Message } from 'discord.js';

import { Command, RawContext } from '@/commands/types';
import { Context, resolveLocale } from '@/contexts/Context';
import { ContextMetadata } from '@/contexts/ContextMetadata';
import { db } from '@/database';
import { ErrorHandler } from '@/errors/handler';
import { createT } from '@/i18n/fluent/createT';
import { commandPipeline } from '@/middlewares/index';
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

    const metadata = new ContextMetadata({
        locale: resolveLocale(rawContext, settings?.language),
        personality: guildSettings?.personality,
        emotion: guildSettings?.emotion,
        streak: repeatCount,
    });

    const ctx = new Context(rawContext, metadata);

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
