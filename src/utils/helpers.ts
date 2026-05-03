import { Message } from "discord.js";
import { CommandContext } from "../types";

export async function universalReply(context: CommandContext, options: string | any) {
    const payload = typeof options == 'string' ? { context: options } : options;

    if (context instanceof Message) {
        return await context.reply(payload);
    } else {
        if (context.replied || context.deferred) {
            return await context.editReply(payload);
        }
        return await context.reply(payload);
    }
}