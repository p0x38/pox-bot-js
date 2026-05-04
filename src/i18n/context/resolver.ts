import type { EmotionType, I18nContext, Personality } from './types.js';

export function buildContext(input: {
    userId: string;
    guildId?: string;
    locale: string;
    isAdmin?: boolean;
    isNewUser?: boolean;
    level?: number;
    personality?: Personality;
    emotion?: EmotionType;
    streak?: number;
}): I18nContext {
    const hour = new Date().getHours();

    return {
        userId: input.userId,
        guildId: input.guildId,

        isGuild: !!input.guildId,
        isDM: !input.guildId,

        locale: input.locale,

        hour,

        isAdmin: input.isAdmin ?? false,
        isNewUser: input.isNewUser ?? false,

        level: input.level,
        personality: input.personality ?? {
            type: 'casual',
            intensity: 'normal',
        },
        emotion: input.emotion ?? 'happy',
        streak: input.streak ?? 1,
    };
}
