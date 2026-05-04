import {
  db
} from "../../chunk-QR4SPJXM.js";
import {
  i18n_default,
  languages
} from "../../chunk-MTF4G4PS.js";
import "../../chunk-JINUGYJW.js";
import "../../chunk-LGWVEOJC.js";

// src/commands/settings/setlang.ts
import { SlashCommandBuilder } from "discord.js";

// src/utils/langUtils.ts
import ISO6391 from "iso-639-1";
var normalizeLangName = (code) => {
  return ISO6391.getNativeName(code) || code.toUpperCase();
};

// src/commands/settings/setlang.ts
var name = "setlang";
var description = "Change your display language.";
var setlang = {
  name,
  description,
  data: new SlashCommandBuilder().setName(name).setDescription(description).addStringOption(
    (option) => option.setName("language").setDescription("Select the language to set").setRequired(true).setAutocomplete(true)
  ),
  autocomplete: async (interaction) => {
    const focusedValue = interaction.options.getFocused().toLowerCase();
    const choices = languages.filter((lang) => lang !== "cimode").map((lang) => ({
      name: `${normalizeLangName(lang)} (${lang.toUpperCase()})`,
      value: lang
    }));
    const filtered = choices.filter(
      (choice) => choice.name.toLowerCase().includes(focusedValue) || choice.value.toLowerCase().includes(focusedValue)
    ).slice(0, 25);
    await interaction.respond(filtered);
  },
  execute: async (context, t, args) => {
    const lang = args.language;
    const userId = context.user.id;
    if (!languages.includes(lang)) {
      await context.reply({
        content: t("common:errors.invalid_language"),
        ephemeral: true
      });
      return;
    }
    await db.updateSetting(userId, { language: lang });
    const newT = i18n_default.getFixedT(lang);
    const successMessage = newT("common:lang_updated", {
      lang: normalizeLangName(lang)
    });
    await context.reply({
      content: successMessage,
      ephemeral: true
    });
  }
};
var setlang_default = setlang;
export {
  setlang_default as default
};
