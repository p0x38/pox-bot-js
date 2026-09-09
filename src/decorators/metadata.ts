import type { CommandMetadata } from './types';

const commandMetadataKey = Symbol('pox-bot.command');
const commandMethodsMetadataKey = Symbol('pox-bot.command-methods');
const cogMetadataKey = Symbol('pox-bot.cog');
const listenerMethodsMetadataKey = Symbol('pox-bot.listener-methods');

export interface CommandMethodMetadata extends CommandMetadata {
    method: string | symbol;
    autocomplete?: string | symbol;
}

export interface ListenerMethodMetadata {
    event: string;
    method: string | symbol;
    once: boolean;
}

export interface CogMetadata {
    name: string;
    description?: string;
}

export function setCommandMetadata(metadata: Record<PropertyKey, unknown>, value: CommandMetadata): void {
    metadata[commandMetadataKey] = value;
}

export function getCommandMetadata(metadata: Record<PropertyKey, unknown>): CommandMetadata | undefined {
    return metadata[commandMetadataKey] as CommandMetadata | undefined;
}

export function setCogMetadata(metadata: Record<PropertyKey, unknown>, value: CogMetadata): void {
    metadata[cogMetadataKey] = value;
}

export function getCogMetadata(metadata: Record<PropertyKey, unknown>): CogMetadata | undefined {
    return metadata[cogMetadataKey] as CogMetadata | undefined;
}

export function addCommandMethodMetadata(metadata: Record<PropertyKey, unknown>, value: CommandMethodMetadata): void {
    const methods = (metadata[commandMethodsMetadataKey] as CommandMethodMetadata[] | undefined) ?? [];
    methods.push(value);
    metadata[commandMethodsMetadataKey] = methods;
}

export function getCommandMethodMetadata(metadata: Record<PropertyKey, unknown>): readonly CommandMethodMetadata[] {
    return (metadata[commandMethodsMetadataKey] as CommandMethodMetadata[] | undefined) ?? [];
}

export function addListenerMethodMetadata(metadata: Record<PropertyKey, unknown>, value: ListenerMethodMetadata): void {
    const methods = (metadata[listenerMethodsMetadataKey] as ListenerMethodMetadata[] | undefined) ?? [];
    methods.push(value);
    metadata[listenerMethodsMetadataKey] = methods;
}

export function getListenerMethodMetadata(metadata: Record<PropertyKey, unknown>): readonly ListenerMethodMetadata[] {
    return (metadata[listenerMethodsMetadataKey] as ListenerMethodMetadata[] | undefined) ?? [];
}

export type { CommandMetadata } from './types';
