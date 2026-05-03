"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const node_path_1 = __importDefault(require("node:path"));
const node_fs_1 = require("node:fs");
const i18n_1 = __importDefault(require("./i18n"));
require("dotenv/config");
const logger_1 = __importDefault(require("./logger"));
const database_1 = require("./database");
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent
    ]
});
const commands = new discord_js_1.Collection();
client.commands = commands;
client.i18n = i18n_1.default;
const commandsPath = node_path_1.default.join(__dirname, 'commands');
const eventsPath = node_path_1.default.join(__dirname, 'events');
function loadCommands(dir) {
    const files = (0, node_fs_1.readdirSync)(dir);
    for (const file of files) {
        const fullPath = node_path_1.default.join(dir, file);
        const stat = (0, node_fs_1.statSync)(fullPath);
        if (stat.isDirectory()) {
            loadCommands(fullPath);
        }
        else if (file.endsWith('.ts') || file.endsWith('.js')) {
            try {
                const commandModule = require(fullPath);
                const command = commandModule.default || commandModule;
                if (command && command.name) {
                    client.commands.set(command.name, command);
                }
            }
            catch (error) {
                logger_1.default.error(`Failed to load command at ${fullPath}:`, error);
            }
        }
    }
}
loadCommands(commandsPath);
const gratefulShutdown = async () => {
    console.log('Shutdowning the bot...');
    await database_1.db.pool.end();
    process.exit(0);
};
process.on('uncaughtException', (err) => {
    logger_1.default.error('Fatal error raised:', err);
    setTimeout(() => process.exit(1), 1000);
});
process.on('unhandledRejection', (error) => {
    logger_1.default.error('Unhandled rejection raised:', error);
});
process.on('SIGINT', gratefulShutdown);
process.on('SIGTERM', gratefulShutdown);
async function bootstrap() {
    try {
        logger_1.default.info('Loading commands...');
        loadCommands(commandsPath);
        logger_1.default.info('Running database migrations...');
        await database_1.db.runMigrations();
        const eventFiles = (0, node_fs_1.readdirSync)(eventsPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));
        for (const file of eventFiles) {
            const filePath = node_path_1.default.join(eventsPath, file);
            const module = require(filePath);
            const event = module.default || module;
            if (!event || !event.name)
                continue;
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, commands));
            }
            else {
                client.on(event.name, (...args) => event.execute(...args, commands));
            }
        }
        await client.login(process.env.DISCORD_TOKEN);
    }
    catch (error) {
        logger_1.default.error('Failed to start the bot:', error);
        process.exit(1);
    }
}
bootstrap();
