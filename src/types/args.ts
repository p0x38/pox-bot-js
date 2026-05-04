import type { CONVERTER_MAP } from '@/converters';
import type {
    ConverterConstructor,
    IConverter,
} from '@/converters/BaseConverter';

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
