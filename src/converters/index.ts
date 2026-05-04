import logger from '../logger';
import { SettingsConverter } from './SettingsConverter';
import { MemberConverter } from './MemberConverter';
import { UserConverter } from './UserConverter';
import { ConverterClass, type Converter } from './BaseConverter';

export const CONVERTER_MAP = {
    string: {
        convert: async (_ctx, value) => value,
    },
    number: {
        convert: async (_ctx, value) => Number(value),
    },
    boolean: {
        convert: async (_ctx, value) =>
            ['true', 'yes', 'on'].includes(value.toLowerCase()),
    },
    user: UserConverter,
    member: MemberConverter,
    settings: SettingsConverter,
} satisfies Record<string, Converter<any>>;

export function registerConverter(
    type: string,
    converterClass: ConverterClass,
) {
    (CONVERTER_MAP as Record<string, ConverterClass>)[type] = converterClass;
    logger.info(`[Extension] Registered new converter: ${type}`);
}
