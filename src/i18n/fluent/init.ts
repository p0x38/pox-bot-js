import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

import { FluentBundle, FluentResource } from '@fluent/bundle';

import { getCache } from '../cache.js';
import { getFluentPath } from '../paths.js';

export function getBundle(locale: string) {
    return getCache(`fluent:${locale}`, () => {
        let file = join(getFluentPath(), `${locale}.ftl`);

        if (!existsSync(file)) {
            // Try base language (e.g. ja-JP -> ja)
            const baseLocale = locale.split('-')[0]!;
            file = join(getFluentPath(), `${baseLocale}.ftl`);
            if (!existsSync(file)) return null;
        }

        const source = readFileSync(file, 'utf-8');

        const resource = new FluentResource(source);
        const bundle = new FluentBundle(locale, {
            useIsolating: false,
        });

        const errors = bundle.addResource(resource);
        if (errors.length > 0) {
            console.error(`Fluent errors in ${locale}:`, errors);
        }

        return bundle;
    });
}
