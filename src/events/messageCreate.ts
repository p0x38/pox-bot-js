import { Collection, Events, Message } from "discord.js";
import { BotEvent } from "./event";
import { Command } from "../types";
import { db } from "../database";
import i18n from "../i18n";
import config from "../../config.json";
import logger from "../logger";
import runCommand from "../utils/runCommand";
import i18next from "i18next";

const event: BotEvent<Events.MessageCreate> = {
    name: Events.MessageCreate,
    async execute(message: Message, commands: Collection<string, Command>) {
        if (message.author.bot) return;

        const userSettings = await db.getUserSettings(message.author.id);
        const lang = userSettings.language || 'en';

        const t = i18next.getFixedT(lang);

        try {
            const oldProfile = await db.getUserProfile(message.author.id) as any;
            const oldLevel = oldProfile?.level || 1;

            const messageContent = message.cleanContent;
            const messageWords = messageContent.split(/\s+/).length;
            const messageLetters = messageContent.length;

            const finalXpToAdd = 5 * ((messageWords / 30) + (messageLetters / 30) / 6);

            await db.addExperience(message.author.id, finalXpToAdd | 0);

            const newProfile = await db.getUserProfile(message.author.id) as any;
            const newLevel = newProfile?.level || 1;

            if (newLevel > oldLevel) {
                await message.reply(t('common:levelup', { level: newLevel, lng: lang }));
            }
        } catch (err) {
            logger.error('XP Update failed:', err);
        }

        if (!message.content.startsWith(config.bot_prefix)) return;

        const args = message.content.slice(config.bot_prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        if (!commandName) return;

        const command = commands.get(commandName);
        if (command) {
            await runCommand(message, command, t)
        }
    }
}

export default event;