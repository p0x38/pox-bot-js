import { ChatInputCommandInteraction, Message, PermissionResolvable, PermissionsBitField } from "discord.js";
import config from '../../config.json';
import { BotMissingPermissions, CommandDisabled, MissingPermissions, NoPrivateMessage, NotOwner } from "./error";

type CommandContext = Message | ChatInputCommandInteraction;

export class Guards {
    static ownerOnly(context: CommandContext) {
        const user = context instanceof Message ? context.author : context.user;

        if (user.id !== config.ownerId) {
            throw new NotOwner();
        }
    }

    static hasPermissions(context: CommandContext, perms: PermissionResolvable[]) {
        const member = context.member;

        if (!member || !('permissions' in member)) {
            throw new MissingPermissions(perms.map(p => p.toString()));
        }

        const permissions = member.permissions as PermissionsBitField;

        const missing = perms.filter(p => !permissions.has(p));
        if (missing.length > 0) {
            throw new MissingPermissions(missing.map(p => p.toString()));
        }
    }

    static botHasPermissions(context: CommandContext, perms: PermissionResolvable[]) {
        const me = context.guild?.members.me;

        if (!me) {
            throw new NoPrivateMessage();
        }

        const permissions = me.permissions as PermissionsBitField;

        const missing = perms.filter(p => !permissions.has(p));
        if (missing.length > 0) {
            throw new BotMissingPermissions(missing.map(p => p.toString()));
        }
    }

    static guildOnly(context: CommandContext) {
        if (!context.guild) {
            throw new NoPrivateMessage();
        }
    }

    static checkCommandEnabled(commandName: string) {
        const disabledCommands: string[] = [];
        if (disabledCommands.includes(commandName)) {
            throw new CommandDisabled();
        }
    }
}