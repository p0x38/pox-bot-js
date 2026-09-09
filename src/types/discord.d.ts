import type { Client } from 'discord.js';

import type { Config } from '@/config';
import type { ContextServicesMetadata } from '@/contexts/ContextServicesMetadata';

export {};

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, import('@/commands/types').Command>;
        config: Config;
        configManager: import('@/config').ConfigManager;
        i18n: typeof import('@/i18n').default;
        services: ContextServicesMetadata;
    }
}
