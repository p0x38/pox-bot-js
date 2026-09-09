import { Message } from 'discord.js';

import { Command, RawContext } from '@/commands/types';
import { Context, resolveLocale } from '@/contexts/Context';
import { ContextMetadata } from '@/contexts/ContextMetadata';
import { ContextServicesMetadata } from '@/contexts/ContextServicesMetadata';
import { ErrorHandler } from '@/errors/handler';
import { createT } from '@/i18n/fluent/createT';
import { commandPipeline } from '@/middlewares/index';

export interface CommandRuntimeServices
    extends Omit<
        ConstructorParameters<typeof ContextServicesMetadata>[0],
        'commandTracker'
    > {
    commandTracker: ConstructorParameters<
        typeof ContextServicesMetadata
    >[0]['commandTracker'];
}

export default async function (
    rawContext: RawContext,
    command: Command,
    services: CommandRuntimeServices,
) {
    const userId =
        rawContext instanceof Message
            ? rawContext.author.id
            : rawContext.user.id;

    const settings = await services.db.getUserSettings(userId);
    const guildSettings = rawContext.guildId
        ? await services.db.getGuildSettings(rawContext.guildId)
        : null;

    const repeatCount = services.commandTracker.recordAndGetCount(
        userId,
        command.name,
    );

    const metadata = new ContextMetadata({
        locale: resolveLocale(rawContext, settings?.language),
        personality: guildSettings?.personality,
        emotion: guildSettings?.emotion,
        streak: repeatCount,
    });

    const ctx = new Context(
        rawContext,
        metadata,
        new ContextServicesMetadata(services),
    );

    if (repeatCount >= 5) {
        ctx.emotion = 'frustration';
    } else if (repeatCount >= 3) {
        ctx.emotion = 'annoyed';
    }

    const t = createT(ctx) as any;

    try {
        await commandPipeline(ctx, command, t);

        if (ctx.emotion === 'happy' || ctx.emotion === 'neutral') {
            ctx.emotion = 'joy';
        }
    } catch (error) {
        ctx.emotion = 'frustration';

        await ErrorHandler.handle(error, ctx, t, {
            command: command.name,
        });
    }
}
