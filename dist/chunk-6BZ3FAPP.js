import {
  i18n_default,
  languages
} from "./chunk-MTF4G4PS.js";

// src/utils/translator.ts
var DISCORD_LOCALE_MAP = {
  ja: "ja",
  en: "en-US",
  ko: "ko",
  es: "es-ES",
  zh: "zh-TW"
};
function localizeCommand(builder, commandKey) {
  const descriptionLocalizations = {};
  for (const lang of languages) {
    const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;
    const slashPath = `${commandKey}.description.slash`;
    const directPath = `${commandKey}.description`;
    const description = i18n_default.exists(slashPath, { lng: lang }) ? i18n_default.t(slashPath, { lng: lang }) : i18n_default.t(directPath, { lng: lang });
    if (description !== directPath && description !== slashPath) {
      descriptionLocalizations[discordLocale] = description;
    }
  }
  if (typeof builder.setDescriptionLocalizations === "function") {
    builder.setDescriptionLocalizations(descriptionLocalizations);
  }
  if (builder.options && Array.isArray(builder.options)) {
    builder.options.forEach((option) => {
      if (typeof option.setDescriptionLocalizations === "function") {
        const optionName = option.name;
        const optionKey = `${commandKey}.options.${optionName}.description`;
        const oDescLocs = {};
        for (const lang of languages) {
          const discordLocale = DISCORD_LOCALE_MAP[lang] || lang;
          const oDesc = i18n_default.t(optionKey, { lng: lang });
          if (oDesc !== optionKey) {
            oDescLocs[discordLocale] = oDesc;
          }
        }
        option.setDescriptionLocalizations(oDescLocs);
      }
    });
  }
  return builder;
}

export {
  localizeCommand
};
