import type { I18nContext } from './types.js';

export type Rule = {
    match: (ctx: I18nContext) => boolean;
    replace: string | ((ctx: I18nContext) => string);
};

export const rules: Record<string, Rule[]> = {
    greeting: [
        {
            match: (ctx) => ctx.hour < 5,
            replace: 'Still awake? Night own detected :3',
        },
        {
            match: (ctx) => ctx.hour < 12,
            replace: 'Good marning! :3',
        },
    ],
};
