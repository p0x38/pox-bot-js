import { Pool } from 'pg';

import { env } from '@/config/env';
import { logger } from '@/logger';

export const pool = new Pool({
    host: env.postgresHost(),
    user: env.postgresUser(),
    password: env.postgresPassword(),
    database: env.postgresDatabase(),
    port: env.postgresPort(),
});

pool.on('connect', () => {
    logger.info('Connected to PostgreSQL');
});

pool.on('error', (err) => {
    logger.error('PostgreSQL raised an error:', err);
});
