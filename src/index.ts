import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

import { Client, GatewayIntentBits, Collection } from 'discord.js';

import { Command } from '@/commands/types';
import { ConfigManager, type Config } from '@/config';
import { ContextServicesMetadata } from '@/contexts/ContextServicesMetadata';
import { db } from '@/database';
import { ExtensionManager } from '@/managers/extension';
import i18n from '@/i18n';
import 'dotenv/config';
import { logger } from '@/logger';
import { commandTracker } from '@/services/commandTracker.service';
import * as xpService from '@/services/xpService';

import { InstanceLock } from './application/InstanceLock';

const lock = new InstanceLock();
const configManager = new ConfigManager();
const extensionManager = new ExtensionManager();

try {
    await lock.acquire();
} catch (error) {
    logger.error('Failed to acquire instance lock:', error);
    process.exit(1);
}

let shuttingDown = false;
let config: Config;

const shutdown = async (signal: string, exitCode = 0) => {
    if (shuttingDown) {
        return;
    }

    shuttingDown = true;

    logger.info(`Received ${signal}, shutting down...`);

    try {
        await extensionManager.teardownAll();
        await lock.release();
        await db.pool.end();

        logger.info('Shutdown complete.');
    } catch (error) {
        logger.error('Error during shutdown:', error);
        exitCode = 1;
    }

    process.exit(exitCode);
};

process.once('SIGINT', () => {
    void shutdown('SIGINT');
});

process.once('SIGTERM', () => {
    void shutdown('SIGTERM');
});

process.once('uncaughtException', (error) => {
    logger.error('Fatal error raised:', error);

    void shutdown('uncaughtException', 1);
});

process.once('unhandledRejection', (error) => {
    logger.error('Unhandled rejection raised:', error);

    void shutdown('unhandledRejection', 1);
});

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const commands = new Collection<string, Command>();

client.commands = commands;
client.i18n = i18n;
client.configManager = configManager;

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
                    client.commands.set(command.name, command);
                }
            } catch (error) {
                logger.error(`Failed to load command at ${fullPath}:`, error);
            }
        }
    }
}

async function bootstrap() {
    try {
        logger.info('Loading configuration...');
        config = await configManager.load();

        client.config = config;
        client.services = new ContextServicesMetadata({
            config,
            configManager,
            db,
            i18n,
            logger,
            extensionManager,
            commandTracker,
            xpService,
        });

        logger.info(`Using configuration from ${configManager.getPath()}`);
        logger.info(`Default language: ${config.defaultLanguage}`);

        logger.info('Running database migrations...');
        await db.runMigrations();

        logger.info('Loading commands...');
        await loadCommands(commandsPath);

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

        await extensionManager.setupAll();
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        logger.error('Failed to start the bot:', error);
        await shutdown('bootstrap failure', 1);
    }
}

bootstrap();
