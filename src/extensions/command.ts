import type { Command } from '@/commands/types';
import type { Extension } from './types';
import type { ExtensionManager } from './manager';
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
        const metadata = getCommandMetadata(
            CommandClass as DecoratedCommandConstructorWithMetadata,
        );

        if (!metadata) {
            throw new TypeError(
                `Command class ${CommandClass.name || '<anonymous>'} is missing @Command`,
            );
        }

        const methodMetadata = getCommandMethodMetadata(
            CommandClass as DecoratedCommandConstructorWithMetadata,
        );

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
            name: metadata.name,
            description: metadata.description,
            usage: metadata.usage,
            ownerOnly: metadata.ownerOnly,
            guildOnly: metadata.guildOnly,
            permissions: metadata.permissions,
            botPermissions: metadata.botPermissions,
            cooldown: metadata.cooldown,
            execute: execute.bind(instance) as Command['execute'],
        });
    }

    return {
        name: 'commands',
        classes,
        commands,
    };
}
