import { readdirSync, statSync } from 'node:fs';
import path from 'node:path';

export function getLanguages(localesPath: string) {
    const languages = readdirSync(localesPath).filter((file) =>
        statSync(path.join(localesPath, file)).isDirectory(),
    );

    if (!languages.length)
        throw new Error(`No languages found in ${localesPath}`);

    return languages;
}

export function getReferenceLang(languages: string[], defaultLang?: string) {
    return languages.includes(defaultLang ?? '')
        ? defaultLang!
        : (languages[0] ?? 'en');
}

export function getNamespaces(localesPath: string, lang: string) {
    return readdirSync(path.join(localesPath, lang))
        .filter((file) => file.endsWith('.json'))
        .map((file) => path.parse(file).name);
}
