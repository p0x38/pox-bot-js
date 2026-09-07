import { basename } from 'node:path';

import chokidar from 'chokidar';

import { logger } from '@/logger';

import { getLocalePath } from './paths.js';

export function enableLocaleHotReload(clearCache: () => void) {
    const localesPath = getLocalePath();

    const watcher = chokidar.watch(localesPath, {
        ignoreInitial: true,
    });

    watcher.on('change', (file) => {
        logger.info(`[i18n] changed: ${basename(file)}`);
        clearCache();
    });

    watcher.on('add', (file) => {
        logger.info(`[i18n] added: ${basename(file)}`);
        clearCache();
    });

    watcher.on('unlink', (file) => {
        logger.info(`[i18n] removed: ${basename(file)}`);
        clearCache();
    });
}
