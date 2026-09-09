import type { Command } from '@/commands/types';
import { getCommandMetadata, getCommandMethodMetadata } from '@/decorators';

import type { Extension } from './types';

export interface DecoratedCommandConstructor {
    new (...args: never[]): object;
}

interface DecoratedCommandInstance {
    [key: string | symbol]: unknown;
}

interface DecoratedCommandConstructorWithMetadata extends DecoratedCommandConstructor {
    [Symbol.metadata]?: Record<PropertyKey, unknown>;
}

function getMetadata(
    CommandClass: DecoratedCommandConstructor,
): Record<PropertyKey, unknown> {
    return (
        (CommandClass as DecoratedCommandConstructorWithMetadata)[
            Symbol.metadata
        ] ?? {}
    );
}

export interface CommandExtension extends Extension {
    readonly name: 'commands';
    readonly commands: readonly Command[];
    readonly classes: readonly DecoratedCommandConstructor[];
}

export function createCommandExtension(
    classes: readonly DecoratedCommandConstructor[],
): CommandExtension {
    const commands: Command[] = [];

    for (const CommandClass of classes) {
        const metadata = getMetadata(CommandClass);
        const commandMetadata = getCommandMetadata(metadata);

        if (!commandMetadata) {
            throw new TypeError(
                `Command class ${CommandClass.name || '<anonymous>'} is missing @Command`,
            );
        }

        const methodMetadata = getCommandMethodMetadata(metadata);
        const executeMetadata = methodMetadata.find((method) => method.execute);

        if (!executeMetadata) {
            throw new TypeError(
                `Command class ${CommandClass.name || '<anonymous>'} is missing @Execute`,
            );
        }

        const instance = new CommandClass() as DecoratedCommandInstance;
        const execute = instance[executeMetadata.method];

        if (typeof execute !== 'function') {
            throw new TypeError(
                `@Execute target ${String(executeMetadata.method)} is not a function`,
            );
        }

        const command: Command = {
            name: commandMetadata.name,
            description: commandMetadata.description,
            usage: commandMetadata.usage,
            ownerOnly: commandMetadata.ownerOnly,
            guildOnly: commandMetadata.guildOnly,
            permissions: commandMetadata.permissions as Command['permissions'],
            botPermissions:
                commandMetadata.botPermissions as Command['botPermissions'],
            cooldown: commandMetadata.cooldown,
            execute: execute.bind(instance) as Command['execute'],
        };

        const autocompleteMetadata = methodMetadata.find(
            (method) => method.autocomplete,
        );
        if (autocompleteMetadata) {
            const autocomplete = instance[autocompleteMetadata.method];
            if (typeof autocomplete !== 'function') {
                throw new TypeError(
                    `@autocomplete target ${String(autocompleteMetadata.method)} is not a function`,
                );
            }
            command.autocomplete = autocomplete.bind(
                instance,
            ) as Command['autocomplete'];
        }

        commands.push(command);
    }

    return {
        name: 'commands',
        classes,
        commands,
    };
}
