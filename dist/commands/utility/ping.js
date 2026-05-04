// src/commands/utility/ping.ts
import { Message } from "discord.js";
var ping = {
  name: "ping",
  description: "Retrieves bot latency.",
  guildOnly: false,
  execute: async (context, t) => {
    const latency = context.client.ws.ping;
    const msg = t("messages:commands.ping.success", { latency });
    if (context.raw instanceof Message) {
      await context.reply(msg);
    } else {
      await context.reply({ content: msg });
    }
  }
};
var ping_default = ping;
export {
  ping_default as default
};
