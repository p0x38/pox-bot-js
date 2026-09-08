import type { Command } from '@/commands/types';
import type { Extension } from './types';

export interface CommandExtension extends Extension {
    readonly commands: readonly Command[];
}
