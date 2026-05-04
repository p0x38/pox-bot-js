// src/commands/settings/setcolor.ts
var setcolor = {
  name: "setcolor",
  description: "Set your profile color.",
  guildOnly: false,
  execute: async (context, t) => {
    const msg = t("messages:commands.setcolor.success", { defaultValue: "Color updated!" });
    await context.reply(msg);
  }
};
var setcolor_default = setcolor;
export {
  setcolor_default as default
};
