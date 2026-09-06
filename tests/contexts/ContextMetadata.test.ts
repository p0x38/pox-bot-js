import assert from 'node:assert/strict';
import test from 'node:test';

import { ContextMetadata } from '@/contexts/ContextMetadata';

test('ContextMetadata uses the expected defaults', () => {
    const metadata = new ContextMetadata({ locale: 'en' });

    assert.equal(metadata.locale, 'en');
    assert.deepEqual(metadata.personality, {
        type: 'casual',
        intensity: 'normal',
    });
    assert.equal(metadata.emotion, 'happy');
    assert.equal(metadata.streak, 1);
});

test('ContextMetadata accepts explicit metadata', () => {
    const personality = {
        type: 'silly' as const,
        intensity: 'high' as const,
        disabled: true,
    };

    const metadata = new ContextMetadata({
        locale: 'ja',
        personality,
        emotion: 'joy',
        streak: 42,
    });

    assert.equal(metadata.locale, 'ja');
    assert.deepEqual(metadata.personality, personality);
    assert.equal(metadata.emotion, 'joy');
    assert.equal(metadata.streak, 42);
});

test('ContextMetadata mutates streak state', () => {
    const metadata = new ContextMetadata({ locale: 'en', streak: 3 });

    metadata.incrementStreak();
    metadata.incrementStreak();
    assert.equal(metadata.streak, 5);

    metadata.resetStreak();
    assert.equal(metadata.streak, 1);
});

test('ContextMetadata mutates emotion and personality', () => {
    const metadata = new ContextMetadata({ locale: 'en' });
    const personality = {
        type: 'chaotic' as const,
        intensity: 'high' as const,
    };

    metadata.setEmotion('angry');
    metadata.setPersonality(personality);

    assert.equal(metadata.emotion, 'angry');
    assert.deepEqual(metadata.personality, personality);
});
