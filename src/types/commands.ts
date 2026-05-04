import type { Context } from '@/contexts/Context';
import {
    SlashCommandBuilder,
    SlashCommandOptionsOnlyBuilder,
    SlashCommandSubcommandBuilder,
    PermissionResolvable,
    AutocompleteInteraction,
    type Message,
    type ChatInputCommandInteraction,
    EmbedBuilder,
} from 'discord.js';
import { TFunction } from '@/i18n/fluent/t';
import type { ArgumentDefinition, InferArgs } from './args';
import { EmotionType } from '@/i18n/context/types';

export type RawContext = Message | ChatInputCommandInteraction;

export type CommandContext = Context;

export type SlashCommandData =
    | SlashCommandBuilder
    | SlashCommandOptionsOnlyBuilder
    | SlashCommandSubcommandBuilder;

export type CommandResponse =
    | {
          key?: string;
          vars?: Record<string, any>;
          content?: string;
          emotion?: EmotionType;
          ephemeral?: boolean;
          embeds?: EmbedBuilder[];
          components?: any[];
      }
    | string
    | void;

export interface Command<TArgsDef extends readonly ArgumentDefinition[] = []> {
    name: string;
    description: string;
    usage?: string;

    args?: TArgsDef;

    data?: SlashCommandData;

    ownerOnly?: boolean;
    guildOnly?: boolean;
    permissions?: PermissionResolvable[];
    botPermissions?: PermissionResolvable[];
    cooldown?: number;

    execute: (
        ctx: Context,
        t: TFunction,
        args: InferArgs<TArgsDef>,
    ) => Promise<CommandResponse>;

    autocomplete?: (interaction: AutocompleteInteraction) => Promise<void>;
}
