import { Message } from "discord.js";
import { db } from "../../database";

export class SettingsConverter {
    static async convert(message: Message, value: string) {
        const id = value.match(/\d+/)?.[0] || message.author.id;
        
        return await db.getUserSettings(id);
    }
}