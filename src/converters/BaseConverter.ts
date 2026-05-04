import type { Context } from '@/contexts/Context';

export interface Converter<T> {
    convert(message: Context, value: string): Promise<T | null>;
}

export type ConverterClass = {
    convert: (message: Context, value: string) => Promise<any>;
};
