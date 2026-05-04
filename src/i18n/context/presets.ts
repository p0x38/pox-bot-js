import { Personality } from './types.js';

export const personalityPresets: Record<string, Personality> = {
    neutral: {
        type: 'neutral',
        intensity: 'normal',
    },
    casual: {
        type: 'casual',
        intensity: 'normal',
    },
    assistant: {
        type: 'formal',
        intensity: 'high',
    },
    silly: {
        type: 'silly',
        intensity: 'high',
    },
    gremlin: {
        type: 'chaotic',
        intensity: 'high',
    },
    robotic: {
        type: 'robotic',
        intensity: 'low',
    },
};

export const defaultPersonality = personalityPresets.casual!;
