import 'discord.js';

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, import('@/commands/types').Command>;
        config: import('@/config').Config;
        configManager: import('@/config').ConfigManager;
        i18n: typeof import('@/i18n').default;
        services: import('@/contexts/ContextServicesMetadata').ContextServicesMetadata;
    }
}
