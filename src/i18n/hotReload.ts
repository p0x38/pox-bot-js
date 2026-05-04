import logger from '@/logger.js';
import { getLocalePath } from './paths.js';
import chokidar from 'chokidar';
import { basename } from 'node:path';

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
