import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

import { getPlatformPaths } from '@/platform';

export interface Config {
    bot_prefix: string;
    defaultLanguage: string;
    ownerId: string;
}

export const DEFAULT_APP_NAME = 'p0x38/pox-bot-js';

export class ConfigManager {
    private readonly path: string;

    public constructor(appName = DEFAULT_APP_NAME) {
        const paths = getPlatformPaths(appName);

        this.path = join(paths.config, 'config.json');
    }

    public async load(): Promise<Config> {
        const content = await readFile(this.path, 'utf8');

        return JSON.parse(content) as Config;
    }

    public async save(config: Config): Promise<void> {
        await mkdir(dirname(this.path), { recursive: true });

        await writeFile(
            this.path,
            `${JSON.stringify(config, null, 4)}\n`,
            'utf8',
        );
    }

    public getPath(): string {
        return this.path;
    }
}
