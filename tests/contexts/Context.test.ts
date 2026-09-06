import assert from 'node:assert/strict';
import test from 'node:test';
import { Context, resolveLocale } from '@/contexts/Context';
import { ContextMetadata } from '@/contexts/ContextMetadata';
import { ChatInputCommandInteraction, Message } from 'discord.js';

test('resolveLocale prefers the database locale', () => {
    const raw = {
        guild: null,
    } as unknown as Message;

    assert.equal(resolveLocale(raw, 'ja'), 'ja');
});

test('Context exposes metadata through compatibility accessors', () => {
    const raw = {
        guild: null,
    } as unknown as Message;

    const context = new Context(raw, new ContextMetadata({ locale: 'en' }));

    assert.ok(context.metadata instanceof ContextMetadata);
    assert.equal(context.locale, context.metadata.locale);
    assert.equal(context.personality, context.metadata.personality);
    assert.equal(context.emotion, context.metadata.emotion);
    assert.equal(context.streak, context.metadata.streak);

    context.metadata.incrementStreak();
    assert.equal(context.streak, 2);

    context.emotion = 'joy';
    assert.equal(context.metadata.emotion, 'joy');
});

test('resolveLocale falls back to a guild locale', () => {
    const raw = {
        guild: {
            preferredLocale: 'ja',
        },
    } as unknown as Message;

    assert.equal(resolveLocale(raw), 'ja');
});

test('resolveLocale falls back to English', () => {
    const raw = {
        guild: null,
    } as unknown as Message;

    assert.equal(resolveLocale(raw), 'en');
});

test('resolveLocale uses the interaction locale', () => {
    const raw = Object.create(
        ChatInputCommandInteraction.prototype,
    ) as ChatInputCommandInteraction;

    Object.defineProperty(raw, 'locale', {
        value: 'ja',
    });

    assert.equal(resolveLocale(raw), 'ja');
});
