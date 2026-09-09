import {
    GuildMember,
    Message,
    PermissionResolvable,
} from 'discord.js';

import type { Context } from '@/contexts/Context';
import {
    BotMissingPermissions,
    CommandDisabled,
    MissingPermissions,
    NoPrivateMessage,
    NotOwner,
} from '@/errors/index';

function getUser(context: Context) {
    return context.user;
}

function getMember(context: Context): GuildMember | null {
    if (!context.guild) return null;

    if (context.raw instanceof Message) {
        return context.member;
    }

    return context.member instanceof GuildMember ? context.member : null;
}

export class Guards {
    static runAll(context: Context, command: any) {
        this.checkCommandEnabled(command.name);

        if (command.guildOnly) this.guildOnly(context);
        if (command.ownerOnly) this.ownerOnly(context);
        if (command.permissions)
            this.hasPermissions(context, command.permissions);
        if (command.botPermissions)
            this.botHasPermissions(context, command.botPermissions);
    }

    static ownerOnly(context: Context) {
        const user = getUser(context);

        if (user.id !== context.config.ownerId) {
            throw new NotOwner();
        }
    }

    static guildOnly(context: Context) {
        if (!context.guild) {
            throw new NoPrivateMessage();
        }
    }

    static hasPermissions(context: Context, perms: PermissionResolvable[]) {
        const member = getMember(context);

        if (!member) {
            throw new NoPrivateMessage();
        }

        const permissions = member.permissions;

        const missing = perms.filter((p) => !permissions.has(p));
        if (missing.length > 0) {
            throw new MissingPermissions(missing.map((p) => p.toString()));
        }
    }

    static botHasPermissions(context: Context, perms: PermissionResolvable[]) {
        if (!context.guild) {
            throw new NoPrivateMessage();
        }

        const me = context.guild.members.me;

        if (!me) {
            throw new NoPrivateMessage();
        }

        const missing = perms.filter((p) => !me.permissions.has(p));
        if (missing.length > 0) {
            throw new BotMissingPermissions(missing.map((p) => p.toString()));
        }
    }

    static checkCommandEnabled(commandName: string) {
        const disabledCommands: string[] = [];
        if (disabledCommands.includes(commandName)) {
            throw new CommandDisabled();
        }
    }
}
