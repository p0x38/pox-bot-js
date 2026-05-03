import i18next from "i18next";
import { readdirSync, statSync } from "node:fs";
import Backend from 'i18next-fs-backend';
import ICU from "i18next-icu";
import path from "node:path";
import config from "../config.json";

const localesPath = path.join(__dirname, '../resources/locales');
const languages = readdirSync(localesPath).filter(file =>
    statSync(path.join(localesPath, file)).isDirectory()
);

const firstLangPath = path.join(localesPath, languages[0]);
const namespaces = readdirSync(firstLangPath)
    .filter(file => file.endsWith('.json'))
    .map(file => path.parse(file).name);

i18next
    .use(Backend)
    .use(ICU)
    .init({
        backend: {
            loadPath: path.join(__dirname, '../resources/locales/{{lng}}/{{ns}}.json')
        },
        load: 'all',
        lng: config.defaultLanguage,
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

export default i18next;