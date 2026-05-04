import type { Context } from '@/contexts/Context';

export class ConversionError extends Error {
    constructor(
        public readonly key: string,
        public readonly params?: Record<string, any>,
    ) {
        super(key);
        this.name = 'ConversionError';
    }
}

export interface IConverter<T> {
    convert(ctx: Context, value: string): Promise<T>;
}

export abstract class BaseConverter<T> implements IConverter<T> {
    /**
     * Unique Identifier of converter.
     * Will be used for debug/help command.
     */
    abstract readonly name: string;

    /**
     * Expects string as input, and converts into datatype T.
     * @param ctx Command execution context
     * @param value String that inputed from user
     * @throws {ConversionError} When conversion failed
     */
    abstract convert(ctx: Context, value: string): Promise<T>;

    /**
     * Does basic validation if input is not empty.
     */
    protected validateInput(value: string): void {
        if (!value || value.trim().length === 0) {
            throw new ConversionError('error-conversion-empty-input', {
                name: this.name,
            });
        }
    }
}

export type ConverterConstructor<T = any> = new () => BaseConverter<T>;
