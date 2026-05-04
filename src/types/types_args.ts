import type { CONVERTER_MAP } from '@/converters';

type ConverterMap = typeof CONVERTER_MAP;

export type ArgType = keyof ConverterMap;

export type ArgTypeMap = {
    [K in keyof ConverterMap]: Awaited<ReturnType<ConverterMap[K]['convert']>>;
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
