"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalReply = universalReply;
const discord_js_1 = require("discord.js");
async function universalReply(context, options) {
    const payload = typeof options == 'string' ? { context: options } : options;
    if (context instanceof discord_js_1.Message) {
        return await context.reply(payload);
    }
    else {
        if (context.replied || context.deferred) {
            return await context.editReply(payload);
        }
        return await context.reply(payload);
    }
}
