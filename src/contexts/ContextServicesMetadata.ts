import type { Config, ConfigManager } from '@/config';
import type { db } from '@/database';
import type i18n from '@/i18n';
import type { ExtensionManager } from '@/managers/extension';
import type { commandTracker } from '@/services/commandTracker.service';
import type * as xpService from '@/services/xpService';
import type { Logger } from 'winston';

export interface ContextServicesMetadataOptions {
    config: Config;
    configManager: ConfigManager;
    db: typeof db;
    i18n: typeof i18n;
    logger: Logger;
    extensionManager: ExtensionManager;
    commandTracker: typeof commandTracker;
    xpService: typeof xpService;
}

export class ContextServicesMetadata {
    public readonly config: Config;
    public readonly configManager: ConfigManager;
    public readonly db: typeof db;
    public readonly i18n: typeof i18n;
    public readonly logger: Logger;
    public readonly extensionManager: ExtensionManager;
    public readonly commandTracker: typeof commandTracker;
    public readonly xpService: typeof xpService;

    constructor(options: ContextServicesMetadataOptions) {
        this.config = options.config;
        this.configManager = options.configManager;
        this.db = options.db;
        this.i18n = options.i18n;
        this.logger = options.logger;
        this.extensionManager = options.extensionManager;
        this.commandTracker = options.commandTracker;
        this.xpService = options.xpService;
    }
}
