import type { Command } from '@/commands/types';
import type { Extension } from './types';
import type { ExtensionManager } from './manager';

export interface CommandExtension extends Extension {
    readonly name: 'commands';
    readonly commands: readonly Command[];
}

export function createCommandExtension(
    commands: readonly Command[],
): CommandExtension {
    return {
        name: 'commands',
        commands,
        setup(_manager: ExtensionManager) {},
    };
}
