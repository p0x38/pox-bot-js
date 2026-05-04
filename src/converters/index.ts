import logger from '@/logger';
import type { ConverterConstructor, IConverter } from './BaseConverter';
import { MemberConverter } from './MemberConverter';
import { SettingsConverter } from './SettingsConverter';
import { UserConverter } from './UserConverter';
import type { Context } from '@/contexts/Context';

type ConverterEntry = IConverter<any> | ConverterConstructor;

export const CONVERTER_MAP = {
    string: {
        convert: async (_ctx, value) => value,
    } as IConverter<string>,
    number: {
        convert: async (_ctx, value) => Number(value),
    } as IConverter<number>,
    boolean: {
        convert: async (_ctx, value) =>
            ['true', 'yes', 'on'].includes(value.toLowerCase()),
    } as IConverter<boolean>,
    user: UserConverter,
    member: MemberConverter,
    settings: SettingsConverter,
} satisfies Record<string, ConverterEntry>;

export async function getConvertedValue<T>(
    type: string,
    ctx: Context,
    value: string,
): Promise<T | null> {
    const entry = (CONVERTER_MAP as Record<string, ConverterEntry>)[type];

    if (!entry) {
        logger.error(`[Converter] No converter found for type: ${type}`);
        return null;
    }

    try {
        if (typeof entry === 'function') {
            const converter = new entry();
            return await converter.convert(ctx, value);
        }

        return await entry.convert(ctx, value);
    } catch (error) {
        logger.warn(`[Converter] Failed to convert "${value}" to ${type}`);
        throw error;
    }
}

export function registerConverter(
    type: string,
    converterClass: ConverterConstructor,
) {
    (CONVERTER_MAP as Record<string, ConverterEntry>)[type] = converterClass;
    logger.info(`[Extension] Registered new converter: ${type}`);
}
