import {
  logger_default
} from "../chunk-LGWVEOJC.js";

// src/events/error.ts
import { Events } from "discord.js";
var event = {
  name: Events.Error,
  execute(error) {
    logger_default.error("Discord client raised error:", error);
  }
};
var error_default = event;
export {
  error_default as default
};
