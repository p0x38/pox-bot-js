import type { Config, ConfigManager } from '@/config';
import type { db } from '@/database';
import type i18n from '@/i18n';
import { logger } from '@/logger';

export interface ContextServicesMetadataOptions {
    config: Config;
    configManager: ConfigManager;
    db: typeof db;
    i18n: typeof i18n;
    logger: typeof logger;
}

export class ContextServicesMetadata {
    public readonly config: Config;
    public readonly configManager: ConfigManager;
    public readonly db: typeof db;
    public readonly i18n: typeof i18n;
    public readonly logger: typeof logger;

    constructor(options: ContextServicesMetadataOptions) {
        this.config = options.config;
        this.configManager = options.configManager;
        this.db = options.db;
        this.i18n = options.i18n;
        this.logger = options.logger;
    }
}
