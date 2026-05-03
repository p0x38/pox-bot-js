import { Message, ChatInputCommandInteraction, User, GuildMember, SlashCommandBuilder, SlashCommandOptionsOnlyBuilder, SlashCommandSubcommandBuilder, PermissionResolvable, AutocompleteInteraction } from "discord.js";
import { TFunction } from "i18next";

export type CommandContext = Message | ChatInputCommandInteraction;

export interface ArgumentDefinition {
    name: string;
    type: 'string' | 'number' | 'user' | 'member' | 'boolean';
    required?: boolean;
}

export interface ParsedArgs {
    [key: string]: string | number | boolean | User | GuildMember | undefined;
}

export interface Command {
    name: string;
    description: string;
    usage?: string;
    
    args?: ArgumentDefinition[];
    
    data?: any;
    
    ownerOnly?: boolean;
    guildOnly?: boolean;
    permissions?: PermissionResolvable[];
    botPermissions?: PermissionResolvable[];

    execute: (message: CommandContext,  t: TFunction, args: ParsedArgs) => Promise<void>;
    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}