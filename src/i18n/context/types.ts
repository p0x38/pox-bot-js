import type { CommandContext } from './command.js';

export type PersonalityTone =
    | 'neutral'
    | 'casual'
    | 'formal'
    | 'silly'
    | 'chaotic'
    | 'robotic';

export type PersonalityIntensity = 'low' | 'normal' | 'high';

export type EmotionType =
    | 'neutral'
    | 'sad'
    | 'angry'
    | 'annoyed'
    | 'happy'
    | 'fun'
    | 'panic'
    | 'interested'
    | 'joy'
    | 'frustration';

export interface Personality {
    type: PersonalityTone;
    intensity: PersonalityIntensity;
    disabled?: boolean;
}

export interface I18nContext {
    userId: string;
    guildId?: string;
    isGuild: boolean;
    isDM: boolean;
    locale: string;
    hour: number;
    isNewUser: boolean;
    isAdmin: boolean;
    level?: number;

    personality: Personality;
    emotion: EmotionType;
    streak: number;

    command?: CommandContext;
}
