"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const logger_1 = __importDefault(require("../logger"));
const event = {
    name: discord_js_1.Events.Error,
    execute(error) {
        logger_1.default.error('Discord client raised error:', error);
    }
};
exports.default = event;
