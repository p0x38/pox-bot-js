import { existsSync } from 'node:fs';
import path from 'node:path';

export const getLocalePath = () => {
    const paths = [
        path.join(process.cwd(), 'dist/assets/locales'),
        path.join(process.cwd(), 'dist/locales'),
        path.join(process.cwd(), 'src/assets/locales'),
        path.join(process.cwd(), 'assets/locales'),
    ];

    for (const p of paths) {
        if (existsSync(p)) return p;
    }

    throw new Error(`Locale directory not found`);
};

export const getFluentPath = () => {
    const paths = [
        path.join(process.cwd(), 'dist/assets/fluent'),
        path.join(process.cwd(), 'dist/fluent'),
        path.join(process.cwd(), 'src/assets/fluent'),
        path.join(process.cwd(), 'assets/fluent'),
    ];

    for (const p of paths) {
        if (existsSync(p)) return p;
    }

    throw new Error(`Fluent directory not found`);
};
