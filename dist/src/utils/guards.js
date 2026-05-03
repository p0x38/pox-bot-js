"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Guards = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = __importDefault(require("../../config.json"));
const error_1 = require("./error");
class Guards {
    static ownerOnly(context) {
        const user = context instanceof discord_js_1.Message ? context.author : context.user;
        if (user.id !== config_json_1.default.ownerId) {
            throw new error_1.NotOwner();
        }
    }
    static hasPermissions(context, perms) {
        const member = context.member;
        if (!member || !('permissions' in member)) {
            throw new error_1.MissingPermissions(perms.map(p => p.toString()));
        }
        const permissions = member.permissions;
        const missing = perms.filter(p => !permissions.has(p));
        if (missing.length > 0) {
            throw new error_1.MissingPermissions(missing.map(p => p.toString()));
        }
    }
    static botHasPermissions(context, perms) {
        const me = context.guild?.members.me;
        if (!me) {
            throw new error_1.NoPrivateMessage();
        }
        const permissions = me.permissions;
        const missing = perms.filter(p => !permissions.has(p));
        if (missing.length > 0) {
            throw new error_1.BotMissingPermissions(missing.map(p => p.toString()));
        }
    }
    static guildOnly(context) {
        if (!context.guild) {
            throw new error_1.NoPrivateMessage();
        }
    }
    static checkCommandEnabled(commandName) {
        const disabledCommands = [];
        if (disabledCommands.includes(commandName)) {
            throw new error_1.CommandDisabled();
        }
    }
}
exports.Guards = Guards;
