import {
  db
} from "./chunk-QR4SPJXM.js";
import {
  i18n_default
} from "./chunk-MTF4G4PS.js";
import "./chunk-JINUGYJW.js";
import {
  logger_default
} from "./chunk-LGWVEOJC.js";

// src/index.ts
import { Client, GatewayIntentBits, Collection } from "discord.js";
import path from "path";
import { readdirSync, statSync } from "fs";
import "dotenv/config";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";
var LOCK_FILE = path.join(process.cwd(), ".bot.lock");
if (existsSync(LOCK_FILE)) {
  try {
    const pid = parseInt(readFileSync(LOCK_FILE, "utf8"));
    process.kill(pid, 0);
    logger_default.error(`Bot is already running with PID ${pid}. Exiting to prevent duplication.`);
    process.exit(1);
  } catch (e) {
    unlinkSync(LOCK_FILE);
  }
}
writeFileSync(LOCK_FILE, process.pid.toString());
var client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});
var commands = new Collection();
client.commands = commands;
client.i18n = i18n_default;
var commandsPath = path.join(import.meta.dirname, "commands");
var eventsPath = path.join(import.meta.dirname, "events");
async function loadCommands(dir) {
  const files = readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = statSync(fullPath);
    if (stat.isDirectory()) {
      await loadCommands(fullPath);
    } else if ((file.endsWith(".ts") || file.endsWith(".js")) && !file.endsWith(".d.ts")) {
      try {
        const commandModule = await import(`file://${fullPath}`);
        const command = commandModule.default || commandModule;
        if (command && command.name) {
          client.commands.set(command.name, command);
        }
      } catch (error) {
        logger_default.error(`Failed to load command at ${fullPath}:`, error);
      }
    }
  }
}
var gratefulShutdown = async () => {
  console.log("Shutdowning the bot...");
  if (existsSync(LOCK_FILE)) unlinkSync(LOCK_FILE);
  await db.pool.end();
  process.exit(0);
};
process.on("uncaughtException", (err) => {
  logger_default.error("Fatal error raised:", err);
  setTimeout(() => process.exit(1), 1e3);
});
process.on("unhandledRejection", (error) => {
  logger_default.error("Unhandled rejection raised:", error);
});
process.on("SIGINT", gratefulShutdown);
process.on("SIGTERM", gratefulShutdown);
async function bootstrap() {
  try {
    logger_default.info("Loading commands...");
    await loadCommands(commandsPath);
    logger_default.info("Running database migrations...");
    await db.runMigrations();
    const eventFiles = readdirSync(eventsPath).filter(
      (file) => (file.endsWith(".ts") || file.endsWith(".js")) && !file.endsWith(".d.ts")
    );
    for (const file of eventFiles) {
      const filePath = path.join(eventsPath, file);
      const module = await import(`file://${filePath}`);
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
    logger_default.error("Failed to start the bot:", error);
    process.exit(1);
  }
}
bootstrap();
