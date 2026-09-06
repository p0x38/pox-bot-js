import { rules } from './rules';
import type { I18nContext } from './types';

export function applyContext(text: string, key: string, ctx?: I18nContext) {
    if (!ctx) return text;

    const keyRules = rules[key];
    if (!keyRules) return text;

    for (const rule of keyRules) {
        if (rule.match(ctx)) {
            return typeof rule.replace === 'function'
                ? rule.replace(ctx)
                : rule.replace;
        }
    }

    return text;
}
