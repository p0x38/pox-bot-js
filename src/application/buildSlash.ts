import { SlashCommandBuilder } from 'discord.js';

import type { ArgumentDefinition } from '@/commands/types';

export function buildSlashCommand(
    name: string,
    description: string,
    args: readonly ArgumentDefinition[],
) {
    const builder = new SlashCommandBuilder()
        .setName(name)
        .setDescription(description);

    for (const arg of args) {
        switch (arg.type) {
            case 'string':
                builder.addStringOption((opt) =>
                    opt
                        .setName(arg.name)
                        .setDescription(arg.name)
                        .setRequired(!!arg.required),
                );
                break;
            case 'number':
                builder.addNumberOption((opt) =>
                    opt
                        .setName(arg.name)
                        .setDescription(arg.name)
                        .setRequired(!!arg.required),
                );
                break;
            case 'boolean':
                builder.addBooleanOption((opt) =>
                    opt
                        .setName(arg.name)
                        .setDescription(arg.name)
                        .setRequired(!!arg.required),
                );
                break;
            case 'user':
                builder.addUserOption((opt) =>
                    opt
                        .setName(arg.name)
                        .setDescription(arg.name)
                        .setRequired(!!arg.required),
                );
                break;
            case 'member':
                builder.addUserOption((opt) =>
                    opt
                        .setName(arg.name)
                        .setDescription(arg.name)
                        .setRequired(!!arg.required),
                );
                break;
            default:
                builder.addStringOption((opt) =>
                    opt
                        .setName(arg.name)
                        .setDescription(arg.name)
                        .setRequired(!!arg.required),
                );
        }
    }

    return builder;
}
