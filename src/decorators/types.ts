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
