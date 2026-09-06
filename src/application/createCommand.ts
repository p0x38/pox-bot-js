import type { ArgumentDefinition, Command } from '@/commands/types';

import { buildSlashCommand } from './buildSlash';

export function createCommand<
    TArgs extends readonly ArgumentDefinition[],
>(config: {
    name: string;
    description: string;
    args?: TArgs;
    execute: Command<TArgs>['execute'];
    autocomplete?: Command<TArgs>['autocomplete'];
}): Command<TArgs> {
    return {
        name: config.name,
        description: config.description,
        args: config.args,

        data: config.args
            ? buildSlashCommand(config.name, config.description, config.args)
            : undefined,

        execute: config.execute,
        autocomplete: config.autocomplete,
    };
}
