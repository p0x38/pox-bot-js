import i18next from 'i18next';
import ChainedBackend from 'i18next-chained-backend';
import FSBackend from 'i18next-fs-backend';
import ICU from 'i18next-icu';
import path from 'node:path';

export function initI18n(options: {
    localesPath: string;
    languages: string[];
    namespaces: string[];
    defaultLang: string;
}) {
    const { localesPath, languages, namespaces, defaultLang } = options;

    i18next
        .use(ChainedBackend)
        .use(ICU)
        .init({
            backend: {
                backends: [FSBackend],
                backendOptions: [
                    {
                        loadPath: path.join(localesPath, '{{lng}}/{{ns}}.json'),
                    },
                ],
            },
            lng: defaultLang ?? 'en',
            fallbackLng: 'en',
            preload: languages,
            ns: namespaces,
            defaultNS: 'common',
            interpolation: { escapeValue: false },
        });

    return i18next;
}
