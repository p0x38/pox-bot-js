import type { Client } from 'discord.js';

import type { Command } from '@/commands/types';
import {
    getCogMetadata,
    getCommandMethodMetadata,
    getListenerMethodMetadata,
} from '@/decorators';

export interface CogConstructor {
    new (...args: never[]): object;
    [Symbol.metadata]?: Record<PropertyKey, unknown>;
}

interface Instance {
    [key: string | symbol]: unknown;
}

export class Cog {
    readonly name: string;
    readonly description?: string;

    constructor(name: string, description?: string) {
        this.name = name;
        this.description = description;
    }
}

export interface CogExtension {
    readonly name: string;
    readonly cog: Cog;
    readonly commands: readonly Command[];
}

export function createCogExtension(
    CogClass: CogConstructor,
    client?: Client,
): CogExtension {
    const metadata = CogClass[Symbol.metadata] ?? {};
    const cogMetadata = getCogMetadata(metadata);

    if (!cogMetadata) {
        throw new TypeError(`Cog ${CogClass.name || '<anonymous>'} is missing @cog`);
    }

    const instance = new CogClass() as Instance;
    const commands: Command[] = [];

    for (const commandMetadata of getCommandMethodMetadata(metadata)) {
        if (!commandMetadata.name || !commandMetadata.description) {
            continue;
        }

        const execute = instance[commandMetadata.method];
        if (typeof execute !== 'function') {
            throw new TypeError(`@command target ${String(commandMetadata.method)} is not a function`);
        }

        const command: Command = {
            name: commandMetadata.name,
            description: commandMetadata.description,
            usage: commandMetadata.usage,
            ownerOnly: commandMetadata.ownerOnly,
            guildOnly: commandMetadata.guildOnly,
            permissions: commandMetadata.permissions as Command['permissions'],
            botPermissions: commandMetadata.botPermissions as Command['botPermissions'],
            cooldown: commandMetadata.cooldown,
            execute: execute.bind(instance) as Command['execute'],
        };

        if (commandMetadata.autocomplete) {
            const autocomplete = instance[commandMetadata.autocomplete];
            if (typeof autocomplete !== 'function') {
                throw new TypeError(`@autocomplete target ${String(commandMetadata.autocomplete)} is not a function`);
            }
            command.autocomplete = autocomplete.bind(instance) as Command['autocomplete'];
        }

        commands.push(command);
    }

    if (client) {
        for (const listener of getListenerMethodMetadata(metadata)) {
            const handler = instance[listener.method];
            if (typeof handler !== 'function') {
                throw new TypeError(`@listener target ${String(listener.method)} is not a function`);
            }
            const bound = handler.bind(instance) as (...args: never[]) => unknown;
            if (listener.once) client.once(listener.event, bound);
            else client.on(listener.event, bound);
        }
    }

    return {
        name: cogMetadata.name,
        cog: instance as Cog,
        commands,
    };
}
