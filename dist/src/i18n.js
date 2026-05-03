"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const i18next_1 = __importDefault(require("i18next"));
const node_fs_1 = require("node:fs");
const i18next_fs_backend_1 = __importDefault(require("i18next-fs-backend"));
const i18next_icu_1 = __importDefault(require("i18next-icu"));
const node_path_1 = __importDefault(require("node:path"));
const config_json_1 = __importDefault(require("../config.json"));
const localesPath = node_path_1.default.join(__dirname, '../resources/locales');
const languages = (0, node_fs_1.readdirSync)(localesPath).filter(file => (0, node_fs_1.statSync)(node_path_1.default.join(localesPath, file)).isDirectory());
const firstLangPath = node_path_1.default.join(localesPath, languages[0]);
const namespaces = (0, node_fs_1.readdirSync)(firstLangPath)
    .filter(file => file.endsWith('.json'))
    .map(file => node_path_1.default.parse(file).name);
i18next_1.default
    .use(i18next_fs_backend_1.default)
    .use(i18next_icu_1.default)
    .init({
    backend: {
        loadPath: node_path_1.default.join(__dirname, '../resources/locales/{{lng}}/{{ns}}.json')
    },
    load: 'all',
    lng: config_json_1.default.defaultLanguage,
    fallbackLng: {
        'es-ES': ['es', 'en'],
        'default': ['en'],
    },
    parseMissingKeyHandler: (key) => {
        return key;
    },
    keySeparator: '.',
    preload: languages,
    ns: namespaces,
    defaultNS: 'common',
    interpolation: { escapeValue: false }
});
exports.default = i18next_1.default;
