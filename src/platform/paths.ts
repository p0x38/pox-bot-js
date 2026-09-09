import { homedir, platform, tmpdir } from 'node:os';
import { join } from 'node:path';

export interface PlatformPaths {
    /** Persistent application data. */
    data: string;

    /** User-editable configuration. */
    config: string;

    /** Non-essential cached data. */
    cache: string;

    /** Application log files. */
    logs: string;

    /** Runtime state such as lock files and sockets. */
    runtime: string;

    /** Temporary files. */
    temp: string;
}

export function getPlatformPaths(appName: string): PlatformPaths {
    if (!appName.trim()) {
        throw new Error('Application name must not be empty.');
    }

    const home = homedir();
    const temp = tmpdir();

    switch (platform()) {
        case 'win32': {
            const localAppData =
                process.env.LOCALAPPDATA ?? join(home, 'AppData', 'Local');
            const applicationData = join(localAppData, appName);

            return {
                data: applicationData,
                config: applicationData,
                cache: join(applicationData, 'cache'),
                logs: join(applicationData, 'logs'),
                runtime: join(applicationData, 'runtime'),
                temp: join(temp, appName),
            };
        }

        case 'darwin': {
            const applicationSupport = join(
                home,
                'Library',
                'Application Support',
                appName,
            );

            return {
                data: applicationSupport,
                config: applicationSupport,
                cache: join(home, 'Library', 'Caches', appName),
                logs: join(home, 'Library', 'Logs', appName),
                runtime: join(temp, appName, 'runtime'),
                temp: join(temp, appName),
            };
        }

        default: {
            const dataHome =
                process.env.XDG_DATA_HOME ?? join(home, '.local', 'share');
            const configHome =
                process.env.XDG_CONFIG_HOME ?? join(home, '.config');
            const cacheHome =
                process.env.XDG_CACHE_HOME ?? join(home, '.cache');

            return {
                data: join(dataHome, appName),
                config: join(configHome, appName),
                cache: join(cacheHome, appName),
                logs: join(dataHome, appName, 'logs'),
                runtime:
                    process.env.XDG_RUNTIME_DIR ??
                    join(temp, appName, 'runtime'),
                temp: join(temp, appName),
            };
        }
    }
}
