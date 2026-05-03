"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeLangName = void 0;
const iso_639_1_1 = __importDefault(require("iso-639-1"));
const normalizeLangName = (code) => {
    return iso_639_1_1.default.getNativeName(code) || code.toUpperCase();
};
exports.normalizeLangName = normalizeLangName;
