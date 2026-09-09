import { existsSync } from 'node:fs';
import path from 'node:path';

function firstExistingPath(paths: string[], label: string): string {
    for (const directory of paths) {
        if (existsSync(directory)) return directory;
    }

    throw new Error(`${label} directory not found`);
}

export const getLocalePath = () =>
    firstExistingPath(
        [
            path.join(process.cwd(), 'dist/resources/locales'),
            path.join(process.cwd(), 'src/resources/locales'),
            path.join(process.cwd(), 'resources/locales'),
        ],
        'Locale',
    );

export const getFluentPath = () =>
    firstExistingPath(
        [
            path.join(process.cwd(), 'dist/resources/fluent'),
            path.join(process.cwd(), 'src/resources/fluent'),
            path.join(process.cwd(), 'resources/fluent'),
        ],
        'Fluent',
    );
