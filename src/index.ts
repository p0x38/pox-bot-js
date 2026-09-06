import {
    readdirSync,
    statSync,
    writeFileSync,
    readFileSync,
    unlinkSync,
    existsSync,
} from 'node:fs';
import path from 'node:path';

import { Client, GatewayIntentBits, Collection } from 'discord.js';

import { Command } from '@/commands/types';
import { db } from '@/database';
import i18n from '@/i18n';
import 'dotenv/config';
import logger from '@/logger';

const LOCK_FILE = path.join(process.cwd(), '.bot.lock');

// Check for existing instance
if (existsSync(LOCK_FILE)) {
    try {
        const pid = parseInt(readFileSync(LOCK_FILE, 'utf8'));
        process.kill(pid, 0); // Check if process is still running
        logger.error(
            `Bot is already running with PID ${pid}. Exiting to prevent duplication.`,
        );
        process.exit(1);
    } catch (_e) {
        // Process is dead, we can take over the lock
        unlinkSync(LOCK_FILE);
    }
}

// Create lock
writeFileSync(LOCK_FILE, process.pid.toString());

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const commands = new Collection<string, Command>();

(client as any).commands = commands;
(client as any).i18n = i18n;

const commandsPath = path.join(import.meta.dirname, 'commands');
const eventsPath = path.join(import.meta.dirname, 'events');

async function loadCommands(dir: string) {
    const files = readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            await loadCommands(fullPath);
        } else if (
            (file.endsWith('.ts') || file.endsWith('.js')) &&
            !file.endsWith('.d.ts')
        ) {
            try {
                const commandModule = await import(`file://${fullPath}`);

                const command: Command = commandModule.default || commandModule;

                if (command && command.name) {
                    (client as any).commands.set(command.name, command);
                }
            } catch (error) {
                logger.error(`Failed to load command at ${fullPath}:`, error);
            }
        }
    }
}
// loadCommands(commandsPath); // Redundant, called in bootstrap

const gratefulShutdown = async () => {
    console.log('Shutdowning the bot...');
    if (existsSync(LOCK_FILE)) unlinkSync(LOCK_FILE);
    await db.pool.end();
    process.exit(0);
};

process.on('uncaughtException', (err) => {
    logger.error('Fatal error raised:', err);

    setTimeout(() => process.exit(1), 1000);
});

process.on('unhandledRejection', (error) => {
    logger.error('Unhandled rejection raised:', error);
});

process.on('SIGINT', gratefulShutdown);
process.on('SIGTERM', gratefulShutdown);

async function bootstrap() {
    try {
        logger.info('Loading commands...');
        await loadCommands(commandsPath);

        logger.info('Running database migrations...');
        await db.runMigrations();

        const eventFiles = readdirSync(eventsPath).filter(
            (file) =>
                (file.endsWith('.ts') || file.endsWith('.js')) &&
                !file.endsWith('.d.ts'),
        );
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const module = await import(`file://${filePath}`);
            const event = module.default || module;

            if (!event || !event.name) continue;

            if (event.once) {
                client.once(event.name, (...args) =>
                    event.execute(...args, commands),
                );
            } else {
                client.on(event.name, (...args) =>
                    event.execute(...args, commands),
                );
            }
        }

        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        logger.error('Failed to start the bot:', error);
        process.exit(1);
    }
}

bootstrap();
