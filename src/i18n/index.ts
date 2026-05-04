import config from '../config.json';

import { getLocalePath } from './paths';
import { getLanguages, getReferenceLang, getNamespaces } from './discovery';

import { initI18n } from './init';

const localesPath = getLocalePath();

const languages = getLanguages(localesPath);
console.log('Detected languages:', languages);

const referenceLang = getReferenceLang(languages, config.defaultLanguage);

const namespaces = getNamespaces(localesPath, referenceLang);

const i18n = initI18n({
    localesPath,
    languages,
    namespaces,
    defaultLang: config.defaultLanguage ?? 'en',
});

export { languages };
export default i18n;
