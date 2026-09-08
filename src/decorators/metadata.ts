export interface CommandMetadata {
    name: string;
    description: string;
    usage?: string;
    ownerOnly?: boolean;
    guildOnly?: boolean;
    permissions?: string[];
    botPermissions?: string[];
    cooldown?: number;
}

export interface CommandMethodMetadata {
    execute?: string | symbol;
    autocomplete?: string | symbol;
}

const commandMetadataKey = Symbol('pox-bot.command');
const commandMethodMetadataKey = Symbol('pox-bot.command-method');

export function setCommandMetadata(
    metadata: Record<PropertyKey, unknown>,
    value: CommandMetadata,
): void {
    metadata[commandMetadataKey] = value;
}

export function setCommandMethodMetadata(
    metadata: Record<PropertyKey, unknown>,
    value: Partial<CommandMethodMetadata>,
): void {
    const current =
        (metadata[commandMethodMetadataKey] as CommandMethodMetadata | undefined) ?? {};

    metadata[commandMethodMetadataKey] = { ...current, ...value };
}

export function getCommandMetadata(
    metadata: Record<PropertyKey, unknown>,
): CommandMetadata | undefined {
    return metadata[commandMetadataKey] as CommandMetadata | undefined;
}

export function getCommandMethodMetadata(
    metadata: Record<PropertyKey, unknown>,
): CommandMethodMetadata | undefined {
    return metadata[commandMethodMetadataKey] as
        | CommandMethodMetadata
        | undefined;
}
