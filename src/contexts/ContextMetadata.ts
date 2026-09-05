import type { EmotionType, Personality } from '@/i18n/context/types';

export class ContextMetadata {
    constructor(
        public locale: string,
        public personality: Personality,
        public emotion: EmotionType,
        public streak: number,
    ) {}

    incrementStreak(): void {
        this.streak++;
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
