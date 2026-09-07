import { constants } from 'node:fs';
import { mkdir, open, unlink } from 'node:fs/promises';
import path from 'node:path';

import { getPlatformPaths } from '@/platform';

const APP_NAME = 'pox-bot';

export class InstanceLock {
    private readonly lockPath: string;
    private handle: Awaited<ReturnType<typeof open>> | null = null;

    public constructor() {
        const paths = getPlatformPaths(APP_NAME);

        this.lockPath = path.join(paths.runtime, 'pox-bot.lock');
    }

    public async acquire(): Promise<void> {
        await mkdir(path.dirname(this.lockPath), { recursive: true });

        try {
            this.handle = await open(
                this.lockPath,
                constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL,
            );

            await this.handle.writeFile(
                JSON.stringify({
                    pid: process.pid,
                    startedAt: new Date().toISOString(),
                }),
            );
        } catch (error) {
            if (
                error instanceof Error &&
                'code' in error &&
                error.code === 'EEXIST'
            ) {
                throw new Error(
                    'Another pox-bot instance is already running.',
                    { cause: error },
                );
            }

            throw error;
        }
    }

    public async release(): Promise<void> {
        if (this.handle) {
            await this.handle.close();
            this.handle = null;
        }

        try {
            await unlink(this.lockPath);
        } catch (error) {
            if (
                !(error instanceof Error) ||
                !('code' in error) ||
                error.code !== 'ENOENT'
            ) {
                throw error;
            }

            throw error;
        }
    }
}
