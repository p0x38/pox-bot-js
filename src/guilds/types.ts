import type { EmotionType, Personality } from '@/i18n/context/types';

export interface GuildSettings {
    guildId: string;

    prefix: string;
    language: string;

    defaultCooldown: number;

    roleCooldowns: Record<string, number>;
    disabledCommands: string[];

    personality: Personality;
    emotion: EmotionType;
}
