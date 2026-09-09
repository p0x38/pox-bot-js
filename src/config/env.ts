import 'dotenv/config';

export function getRequiredEnv(name: string): string {
    const value = process.env[name];

    if (!value) {
        throw new Error(
            `Missing required environment variable: ${name}. ` +
                'Put secrets in a local .env file.',
        );
    }

    return value;
}

export const env = {
    discordToken: () => getRequiredEnv('DISCORD_TOKEN'),
    postgresPassword: () => getRequiredEnv('PGPASSWORD'),
    postgresHost: () => process.env.PGHOST ?? 'localhost',
    postgresUser: () => process.env.PGUSER ?? 'postgres',
    postgresDatabase: () => process.env.PGDATABASE ?? 'pox-bot',
    postgresPort: () => {
        const port = Number(process.env.PGPORT ?? '5432');

        if (!Number.isInteger(port) || port < 1 || port > 65535) {
            throw new Error('PGPORT must be a valid TCP port number.');
        }

        return port;
    },
};
