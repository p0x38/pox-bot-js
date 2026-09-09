import type { Command } from '@/commands/types';
import type { Extension } from './types';
import {
    getCommandMetadata,
    getCommandMethodMetadata,
} from '@/decorators';

export interface DecoratedCommandConstructor {
    new (...args: never[]): object;
}

interface DecoratedCommandInstance {
    [key: string | symbol]: unknown;
}

interface DecoratedCommandConstructorWithMetadata
    extends DecoratedCommandConstructor {
    [Symbol.metadata]?: Record<PropertyKey, unknown>;
}

function getMetadata(
    CommandClass: DecoratedCommandConstructor,
): Record<PropertyKey, unknown> {
    return (
        (CommandClass as DecoratedCommandConstructorWithMetadata)[Symbol.metadata] ??
        {}
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

        if (!methodMetadata?.execute) {
            throw new TypeError(
                `Command class ${CommandClass.name || '<anonymous>'} is missing @Execute`,
            );
        }

        const instance = new CommandClass() as DecoratedCommandInstance;
        const execute = instance[methodMetadata.execute];

        if (typeof execute !== 'function') {
            throw new TypeError(
                `@Execute target ${String(methodMetadata.execute)} is not a function`,
            );
        }

        commands.push({
            name: commandMetadata.name,
            description: commandMetadata.description,
            usage: commandMetadata.usage,
            ownerOnly: commandMetadata.ownerOnly,
            guildOnly: commandMetadata.guildOnly,
            permissions: commandMetadata.permissions as Command['permissions'],
            botPermissions: commandMetadata.botPermissions as Command['botPermissions'],
            cooldown: commandMetadata.cooldown,
            execute: execute.bind(instance) as Command['execute'],
        });
    }

    return {
        name: 'commands',
        classes,
        commands,
    };
}
