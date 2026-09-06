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

import type { Context } from '@/contexts/Context';
import type { CONVERTER_MAP } from '@/converters';
import type {
    ConverterConstructor,
    IConverter,
} from '@/converters/BaseConverter';
import { EmotionType } from '@/i18n/context/types';
import { TFunction } from '@/i18n/fluent/t';

type ConverterMap = typeof CONVERTER_MAP;

export type ArgType = keyof ConverterMap;

type ExtractValue<T> =
    T extends IConverter<infer R>
        ? R
        : T extends ConverterConstructor<infer R>
          ? R
          : never;

export type ArgTypeMap = {
    [K in keyof ConverterMap]: ExtractValue<ConverterMap[K]>;
};

export interface ArgumentDefinition<T extends ArgType = ArgType> {
    name: string;
    type: T;
    required?: boolean;
}

export type InferArgs<T extends readonly ArgumentDefinition[]> = {
    [K in T[number] as K['name']]: K['required'] extends true
        ? ArgTypeMap[K['type']]
        : ArgTypeMap[K['type']] | undefined;
};

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
