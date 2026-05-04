import { applyContext } from '../context/engine';
import type { I18nContext } from '../context/types';
import { getBundle } from './init';

type Args = Record<string, string | number | boolean>;

const FALLBACK_LOCALE = 'en';

export type TFunction = ReturnType<typeof getT>;

export function t(locale: string, id: string, args?: Args, ctx?: I18nContext) {
    // Strip namespace prefix (e.g., 'commands:') and convert dots/underscores to hyphens
    const cleanId = id.includes(':') ? id.split(':').slice(1).join('-') : id;
    const normalizedId = cleanId.replace(/[._]/g, '-');

    const bundle = getBundle(locale) ?? getBundle(FALLBACK_LOCALE);

    if (!bundle) {
        console.log(`[Fluent] No bundle found for ${locale}`);
        return id;
    }

    const activeBundle = bundle.hasMessage(normalizedId)
        ? bundle
        : getBundle(FALLBACK_LOCALE);

    if (!activeBundle) return id;

    if (!activeBundle.hasMessage(normalizedId)) {
        console.log(
            `[Fluent] Key NOT found: "${normalizedId}" (original: "${id}")`,
        );
    }

    const msg = activeBundle.getMessage(normalizedId);
    if (!msg) {
        console.log(`[Fluent] Message object not found for ${normalizedId}`);
        return id;
    }

    if (!msg.value) {
        console.log(`[Fluent] Message value is null for ${normalizedId}`);
        return id;
    }

    const extendedArgs = {
        ...args,
        personality: ctx?.personality.type ?? 'casual',
        intensity: ctx?.personality.intensity ?? 'normal',
        emotion: ctx?.emotion ?? 'happy',
        streak: ctx?.streak ?? 1,
    };

    const formatted = activeBundle.formatPattern(msg.value, extendedArgs);

    return applyContext(formatted, id, ctx);
}

export function getT(locale: string, ctx?: I18nContext) {
    return (id: string, args?: Args) => t(locale, id, args, ctx);
}
