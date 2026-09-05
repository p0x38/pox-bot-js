import type { EmotionType, Personality } from '@/i18n/context/types';

export interface ContextMetadataOptions {
    locale: string;
    personality?: Personality;
    emotion?: EmotionType;
    streak?: number;
}

export class ContextMetadata {
    public readonly locale: string;
    public personality: Personality;
    public emotion: EmotionType;
    public streak: number;

    constructor(options: ContextMetadataOptions) {
        this.locale = options.locale;
        this.personality = options.personality ?? {
            type: 'casual',
            intensity: 'normal',
        };
        this.emotion = options.emotion ?? 'happy';
        this.streak = options.streak ?? 1;
    }

    incrementStreak(): void {
        this.streak += 1;
    }

    resetStreak(): void {
        this.streak = 1;
    }

    setEmotion(emotion: EmotionType): void {
        this.emotion = emotion;
    }

    setPersonality(personality: Personality): void {
        this.personality = personality;
    }
}
