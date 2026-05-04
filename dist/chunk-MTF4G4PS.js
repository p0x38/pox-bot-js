import {
  config_default
} from "./chunk-JINUGYJW.js";

// src/i18n/paths.ts
import { existsSync } from "fs";
import path from "path";
var getLocalePath = () => {
  const paths = [
    path.join(process.cwd(), "dist/assets/locales"),
    path.join(process.cwd(), "dist/locales"),
    path.join(process.cwd(), "src/assets/locales"),
    path.join(process.cwd(), "assets/locales")
  ];
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  throw new Error(`Locale directory not found`);
};
var getFluentPath = () => {
  const paths = [
    path.join(process.cwd(), "dist/assets/fluent"),
    path.join(process.cwd(), "dist/fluent"),
    path.join(process.cwd(), "src/assets/fluent"),
    path.join(process.cwd(), "assets/fluent")
  ];
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  throw new Error(`Fluent directory not found`);
};

// src/i18n/discovery.ts
import { readdirSync, statSync } from "fs";
import path2 from "path";
function getLanguages(localesPath2) {
  const languages2 = readdirSync(localesPath2).filter(
    (file) => statSync(path2.join(localesPath2, file)).isDirectory()
  );
  if (!languages2.length)
    throw new Error(`No languages found in ${localesPath2}`);
  return languages2;
}
function getReferenceLang(languages2, defaultLang) {
  return languages2.includes(defaultLang ?? "") ? defaultLang : languages2[0] ?? "en";
}
function getNamespaces(localesPath2, lang) {
  return readdirSync(path2.join(localesPath2, lang)).filter((file) => file.endsWith(".json")).map((file) => path2.parse(file).name);
}

// src/i18n/init.ts
import i18next from "i18next";
import ChainedBackend from "i18next-chained-backend";
import FSBackend from "i18next-fs-backend";
import ICU from "i18next-icu";
import path3 from "path";
function initI18n(options) {
  const { localesPath: localesPath2, languages: languages2, namespaces: namespaces2, defaultLang } = options;
  i18next.use(ChainedBackend).use(ICU).init({
    backend: {
      backends: [FSBackend],
      backendOptions: [
        {
          loadPath: path3.join(localesPath2, "{{lng}}/{{ns}}.json")
        }
      ]
    },
    lng: defaultLang ?? "en",
    fallbackLng: "en",
    preload: languages2,
    ns: namespaces2,
    defaultNS: "common",
    interpolation: { escapeValue: false }
  });
  return i18next;
}

// src/i18n/index.ts
var localesPath = getLocalePath();
var languages = getLanguages(localesPath);
console.log("Detected languages:", languages);
var referenceLang = getReferenceLang(languages, config_default.defaultLanguage);
var namespaces = getNamespaces(localesPath, referenceLang);
var i18n = initI18n({
  localesPath,
  languages,
  namespaces,
  defaultLang: config_default.defaultLanguage ?? "en"
});
var i18n_default = i18n;

export {
  getFluentPath,
  languages,
  i18n_default
};
