import { GuildMember, Message } from "discord.js";
import { IConverter } from "./BaseConverter";

export class MemberConverter {
    static async convert(message: Message, value: string): Promise<GuildMember | undefined> {
        const id = value.match(/\d+/)?.[0];
        if (!id || !message.guild) return undefined;

        return await message.guild?.members.fetch(id).catch(() => undefined);
    }
}