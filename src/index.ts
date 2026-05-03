import { Client, GatewayIntentBits, Collection } from 'discord.js';
import path from 'node:path';
import { readdirSync, statSync } from 'node:fs';
import i18n from './i18n';
import 'dotenv/config';
import logger from './logger';
import { Command, ParsedArgs } from './types';
import { db } from './database';

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const commands = new Collection<string, Command>();

(client as any).commands = commands;
(client as any).i18n = i18n;

const commandsPath = path.join(__dirname, 'commands');
const eventsPath = path.join(__dirname, 'events');

function loadCommands(dir: string) {
    const files = readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = statSync(fullPath);

        if (stat.isDirectory()) {
            loadCommands(fullPath);
        } else if (file.endsWith('.ts') || file.endsWith('.js')) {
            try {
                const commandModule = require(fullPath);

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

loadCommands(commandsPath);

const gratefulShutdown = async () => {
    console.log('Shutdowning the bot...');
    await db.pool.end();
    process.exit(0);
}

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
        loadCommands(commandsPath);

        logger.info('Running database migrations...');
        await db.runMigrations();

        const eventFiles = readdirSync(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = path.join(eventsPath, file);
            const module = require(filePath);
            const event = module.default || module;

            if (!event || !event.name) continue;

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, commands));
            } else {
                client.on(event.name, (...args) => event.execute(...args, commands));
            }
        }

        await client.login(process.env.DISCORD_TOKEN);
        
    } catch (error) {
        logger.error('Failed to start the bot:', error);
        process.exit(1);
    }
}

bootstrap();