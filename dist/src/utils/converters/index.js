"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONVERTER_MAP = void 0;
exports.registerConverter = registerConverter;
const logger_1 = __importDefault(require("../../logger"));
const SettingsConverter_1 = require("./SettingsConverter");
const MemberConverter_1 = require("./MemberConverter");
exports.CONVERTER_MAP = {
    member: MemberConverter_1.MemberConverter,
    user_settings: SettingsConverter_1.SettingsConverter,
};
function registerConverter(type, converterClass) {
    exports.CONVERTER_MAP[type] = converterClass;
    logger_1.default.info(`[Extension] Registered new converter: ${type}`);
}
