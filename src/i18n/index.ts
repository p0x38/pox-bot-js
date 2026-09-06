import config from '../config.json';
import { getLanguages, getReferenceLang, getNamespaces } from './discovery';
import { initI18n } from './init';
import { getLocalePath } from './paths';

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
