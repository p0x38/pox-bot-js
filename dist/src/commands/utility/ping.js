"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const ping = {
    name: 'ping',
    description: 'Retrieves bot latency.',
    guildOnly: false,
    execute: async (context, t, args) => {
        const latency = context.client.ws.ping;
        const msg = t('messages:commands.ping.success', { latency });
        if (context instanceof discord_js_1.Message) {
            await context.reply(msg);
        }
        else {
            await context.reply({ content: msg });
        }
    }
};
exports.default = ping;
