import logger from "../../logger";
import { SettingsConverter } from "./SettingsConverter";
import { MemberConverter } from "./MemberConverter";
import { ConverterClass } from "./BaseConverter";

export const CONVERTER_MAP: Record<string, ConverterClass> = {
    member: MemberConverter,
    user_settings: SettingsConverter,
}

export function registerConverter(type: string, converterClass: ConverterClass) {
    CONVERTER_MAP[type] = converterClass;
    logger.info(`[Extension] Registered new converter: ${type}`);
}