import {
  db
} from "./chunk-QR4SPJXM.js";
import {
  getFluentPath,
  i18n_default
} from "./chunk-MTF4G4PS.js";
import {
  config_default
} from "./chunk-JINUGYJW.js";
import {
  logger_default
} from "./chunk-LGWVEOJC.js";

// src/utils/ErrorHandler.ts
import { EmbedBuilder } from "discord.js";

// src/utils/error.ts
var BotError = class extends Error {
  constructor(i18nKey, args = {}) {
    super(i18nKey);
    this.i18nKey = i18nKey;
    this.args = args;
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
  i18nKey;
  args;
};
var CommandError = class extends BotError {
};
var CheckFailure = class extends CommandError {
};
var Forbidden = class extends CheckFailure {
};
var NotOwner = class extends Forbidden {
  constructor() {
    super("errors:not_owner");
  }
};
var MissingPermissions = class extends CheckFailure {
  constructor(perms, i18nKey = "errors:missing_permissions", args = {}) {
    super(i18nKey, { perms: perms.join(", "), ...args });
  }
};
var NoPrivateMessage = class extends CheckFailure {
  constructor() {
    super("errors:guild_only");
  }
};
var UserInputError = class extends CommandError {
};
var MissingRequiredArgument = class extends UserInputError {
  constructor(argName) {
    super("errors:missing_arg", { argName });
  }
};

// src/utils/ErrorHandler.ts
var ErrorHandler = class {
  static async handle(error, context, t2, meta) {
    const err = error instanceof Error ? error : new Error(String(error));
    logger_default.error("Command error:", {
      message: err.message,
      stack: err.stack,
      user: context.user.id,
      guild: context.guild?.id ?? "DM",
      command: meta?.command
    });
    let displayMessage;
    if (error instanceof BotError) {
      displayMessage = t2(error.i18nKey, {
        ...error.args,
        returnObjects: false
      });
    } else {
      displayMessage = t2("errors:unknown_error");
    }
    const embed = new EmbedBuilder().setTitle(t2("errors:title")).setDescription(displayMessage).setColor(16730955).setTimestamp();
    try {
      await context.reply({
        embeds: [embed],
        ephemeral: true
      });
    } catch (replyError) {
      logger_default.error("Failed to send error response:", replyError);
    }
  }
};

// src/contexts/Context.ts
import {
  Message,
  ChatInputCommandInteraction,
  MessageFlags,
  PermissionFlagsBits,
  GuildMember
} from "discord.js";
function resolveLocale(raw, dbLocale) {
  if (dbLocale) return dbLocale;
  if (raw instanceof ChatInputCommandInteraction) {
    return raw.locale;
  }
  if (raw.guild?.preferredLocale) {
    return raw.guild.preferredLocale;
  }
  return "en";
}
var Context = class _Context {
  raw;
  locale;
  personality;
  emotion;
  streak;
  constructor(ctx, dbLocale, personality, emotion, streak) {
    if (ctx instanceof _Context) {
      throw new Error("Context cannot wrap another Context");
    }
    this.raw = ctx;
    this.locale = resolveLocale(ctx, dbLocale);
    this.personality = personality ?? { type: "casual", intensity: "normal" };
    this.emotion = emotion ?? "happy";
    this.streak = streak ?? 1;
  }
  get user() {
    return this.raw instanceof Message ? this.raw.author : this.raw.user;
  }
  get guild() {
    return this.raw.guild;
  }
  get channel() {
    return this.raw.channel;
  }
  get client() {
    return this.raw.client;
  }
  get member() {
    if (!this.guild) return null;
    if (this.raw instanceof Message) {
      return this.raw.member;
    }
    return this.raw.member instanceof GuildMember ? this.raw.member : null;
  }
  get interaction() {
    return this.raw instanceof ChatInputCommandInteraction ? this.raw : null;
  }
  get isAdmin() {
    return this.member?.permissions.has(PermissionFlagsBits.Administrator) ?? false;
  }
  get interactionType() {
    return this.raw instanceof ChatInputCommandInteraction ? "slash" : "prefix";
  }
  get command() {
    if (this.raw instanceof ChatInputCommandInteraction) {
      return {
        commandName: this.raw.commandName,
        subcommand: this.raw.options.getSubcommand(false) ?? void 0,
        interactionType: "slash"
      };
    }
    return void 0;
  }
  get replied() {
    return this.interaction?.replied ?? false;
  }
  get deferred() {
    return this.interaction?.deferred ?? false;
  }
  get options() {
    return this.interaction?.options ?? null;
  }
  async reply(input) {
    const options = typeof input === "string" ? { content: input } : input;
    const { content, embeds, components, ephemeral, deleteAfter } = options;
    if (this.raw instanceof Message) {
      const msgOptions = {
        content,
        embeds,
        components
      };
      const sent2 = await this.raw.reply(msgOptions);
      if (deleteAfter) this.safeDelete(sent2, deleteAfter);
      return sent2;
    }
    const interactionOptions = {
      content,
      embeds,
      components
    };
    if (ephemeral) {
      interactionOptions.flags = MessageFlags.Ephemeral;
    }
    const sent = this.raw.replied || this.raw.deferred ? await this.raw.followUp(interactionOptions) : await this.raw.reply(interactionOptions);
    if (deleteAfter && !ephemeral && "delete" in sent) {
      this.safeDelete(sent, deleteAfter);
    }
    return;
  }
  async defer(ephemeral = false) {
    if (!(this.raw instanceof ChatInputCommandInteraction)) return;
    if (!this.raw.deferred && !this.raw.replied) {
      await this.raw.deferReply({
        flags: ephemeral ? MessageFlags.Ephemeral : void 0
      });
    }
  }
  async edit(options) {
    const { content, embeds, components } = options;
    if (this.raw instanceof Message) {
      return this.raw.edit({ content, embeds, components });
    }
    const editOptions = { content, embeds, components };
    if (this.raw.replied || this.raw.deferred) {
      return await this.raw.editReply(editOptions);
    }
    return await this.reply(options);
  }
  safeDelete(message, delay) {
    setTimeout(() => {
      message.delete().catch(() => {
      });
    }, delay);
  }
};

// src/middlewares/cooldown.ts
var cooldowns = /* @__PURE__ */ new Map();
var GLOBAL_COOLDOWN = 1500;
var cooldown = async (ctx, command, t2, next) => {
  if (ctx.member?.permissions.has("Administrator")) {
    return next();
  }
  const commandKey = `${command.name}:${ctx.user.id}`;
  const globalKey = `global:${ctx.user.id}`;
  const now = Date.now();
  const commandCooldown = command.cooldown ?? 3e3;
  const lastCommand = cooldowns.get(commandKey) ?? 0;
  const lastGlobal = cooldowns.get(globalKey) ?? 0;
  if (now - lastGlobal < GLOBAL_COOLDOWN) {
    const remaining = ((GLOBAL_COOLDOWN - (now - lastGlobal)) / 1e3).toFixed(1);
    await ctx.reply({
      content: t2("errors:cooldown.global", { time: remaining }),
      ephemeral: true
    });
    return;
  }
  if (now - lastCommand < commandCooldown) {
    const remaining = ((commandCooldown - (now - lastCommand)) / 1e3).toFixed(1);
    await ctx.reply({
      content: t2("errors:cooldown.command", { time: remaining }),
      ephemeral: true
    });
    return;
  }
  cooldowns.set(globalKey, now);
  cooldowns.set(commandKey, now);
  setTimeout(() => cooldowns.delete(globalKey), GLOBAL_COOLDOWN);
  setTimeout(() => cooldowns.delete(commandKey), commandCooldown);
  await next();
};

// src/utils/parser.ts
import { Message as Message2 } from "discord.js";

// src/converters/SettingsConverter.ts
var SettingsConverter = class {
  static async convert(ctx, value) {
    const id = value.match(/\d+/)?.[0] ?? ctx.user.id;
    return await db.getUserSettings(id);
  }
};

// src/converters/MemberConverter.ts
var MemberConverter = class {
  static async convert(ctx, value) {
    const id = value.replace(/[<@!>]/g, "");
    if (!ctx.guild) return void 0;
    return ctx.guild.members.fetch(id).catch(() => void 0);
  }
};

// src/converters/UserConverter.ts
var UserConverter = class {
  static async convert(ctx, value) {
    if (!value) return null;
    const mentionMatch = value.match(/^<@!?(\d+)>$/);
    const idMatch = value.match(/^\d{17,20}$/);
    const id = mentionMatch?.[1] ?? idMatch?.[0];
    if (id) {
      try {
        return await ctx.client.users.fetch(id);
      } catch {
        return null;
      }
    }
    const lower = value.toLowerCase();
    const found = ctx.guild?.members.cache.find(
      (m) => m.user.username.toLowerCase().includes(lower)
    );
    return found?.user ?? null;
  }
};

// src/converters/index.ts
var CONVERTER_MAP = {
  string: {
    convert: async (_ctx, value) => value
  },
  number: {
    convert: async (_ctx, value) => Number(value)
  },
  boolean: {
    convert: async (_ctx, value) => ["true", "yes", "on"].includes(value.toLowerCase())
  },
  user: UserConverter,
  member: MemberConverter,
  settings: SettingsConverter
};

// src/utils/parser.ts
var ArgumentParser = class {
  static async getContextualT(context) {
    const userId = context instanceof Message2 ? context.author.id : context.user.id;
    const userData = await db.getUserSettings(userId);
    const lang = userData.language || config_default.defaultLanguage;
    return i18n_default.getFixedT(lang);
  }
  static async parse(ctx, defs) {
    const result = {};
    for (const def of defs) {
      let rawValue;
      if (ctx.interaction) {
        const option = ctx.interaction.options.get(def.name);
        rawValue = option?.value ?? option?.user ?? option?.member;
      } else if (ctx.raw instanceof Message2) {
        const args = ctx.raw.content.split(/\s+/).slice(1);
        rawValue = args[defs.indexOf(def)];
      }
      if (def.required && (rawValue === void 0 || rawValue === null)) {
        throw new MissingRequiredArgument(def.name);
      }
      if (typeof rawValue === "string") {
        const converter = CONVERTER_MAP[def.type];
        result[def.name] = converter ? await converter.convert(ctx, rawValue) : rawValue;
      } else {
        result[def.name] = rawValue;
      }
    }
    return result;
  }
};

// src/middlewares/executeCommand.ts
var executeCommand = async (ctx, command, t2) => {
  const args = command.args ? await ArgumentParser.parse(ctx, command.args) : {};
  await command.execute(ctx, t2, args);
};

// src/middlewares/guildCheck.ts
var guildOnly = async (ctx, command, t2, next) => {
  if (!command.guildOnly) return next();
  if (!ctx.guild) {
    throw new NoPrivateMessage();
  }
  await next();
};

// src/middlewares/logging.ts
var logging = async (ctx, command, t2, next) => {
  const start = performance.now();
  try {
    await next();
  } finally {
    const duration = performance.now() - start;
    const base = {
      command: command.name,
      user: ctx.user.id,
      guild: ctx.guild?.id ?? "DM",
      duration: Math.round(duration)
    };
    if (duration > 2e3) {
      logger_default.warn("Slow command", base);
    } else {
      logger_default.info("Command executed", base);
    }
  }
};

// src/middlewares/metrics.ts
var stats = /* @__PURE__ */ new Map();
var metrics = async (ctx, command, t2, next) => {
  const key = command.name;
  const data = stats.get(key) ?? { count: 0, errors: 0 };
  data.count++;
  try {
    await next();
  } catch (err) {
    data.errors++;
    throw err;
  } finally {
    stats.set(key, data);
  }
};

// src/middlewares/ownerCheck.ts
var ownerOnly = async (ctx, command, t2, next) => {
  if (!command.ownerOnly) return next();
  if (ctx.user.id !== config_default.ownerId) {
    throw new NotOwner();
  }
  await next();
};

// src/middlewares/permissionCheck.ts
var permissions = async (ctx, command, t2, next) => {
  if (!command.permissions) return next();
  const member = ctx.member;
  if (!member) {
    throw new MissingPermissions(command.permissions.map((p) => String(p)));
  }
  const missing = command.permissions.filter((p) => !member.permissions.has(p));
  if (missing.length > 0) {
    throw new MissingPermissions(missing.map((p) => String(p)));
  }
  await next();
};

// src/middlewares/pipeline.ts
function createPipeline(middlewares) {
  return async function run(ctx, command, t2) {
    let index = -1;
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      const fn = middlewares[i];
      if (!fn) return;
      await fn(ctx, command, t2, () => dispatch(i + 1));
    }
    await dispatch(0);
  };
}

// src/middlewares/index.ts
var commandPipeline = createPipeline([
  logging,
  metrics,
  cooldown,
  ownerOnly,
  guildOnly,
  permissions,
  executeCommand
]);

// src/i18n/context/rules.ts
var rules = {
  greeting: [
    {
      match: (ctx) => ctx.hour < 5,
      replace: "Still awake? Night own detected :3"
    },
    {
      match: (ctx) => ctx.hour < 12,
      replace: "Good marning! :3"
    }
  ]
};

// src/i18n/context/engine.ts
function applyContext(text, key, ctx) {
  if (!ctx) return text;
  const keyRules = rules[key];
  if (!keyRules) return text;
  for (const rule of keyRules) {
    if (rule.match(ctx)) {
      return typeof rule.replace === "function" ? rule.replace(ctx) : rule.replace;
    }
  }
  return text;
}

// src/i18n/fluent/init.ts
import { join } from "path";

// src/i18n/cache.ts
var cache = /* @__PURE__ */ new Map();
function getCache(key, factory) {
  if (cache.has(key)) return cache.get(key);
  const value = factory();
  cache.set(key, value);
  return value;
}

// src/i18n/fluent/init.ts
import { readFileSync, existsSync } from "fs";
import { FluentBundle, FluentResource } from "@fluent/bundle";
function getBundle(locale) {
  return getCache(`fluent:${locale}`, () => {
    let file = join(getFluentPath(), `${locale}.ftl`);
    if (!existsSync(file)) {
      const baseLocale = locale.split("-")[0];
      file = join(getFluentPath(), `${baseLocale}.ftl`);
      if (!existsSync(file)) return null;
    }
    const source = readFileSync(file, "utf-8");
    const resource = new FluentResource(source);
    const bundle = new FluentBundle(locale, {
      useIsolating: false
    });
    const errors = bundle.addResource(resource);
    if (errors.length > 0) {
      console.error(`Fluent errors in ${locale}:`, errors);
    }
    return bundle;
  });
}

// src/i18n/fluent/t.ts
var FALLBACK_LOCALE = "en";
function t(locale, id, args, ctx) {
  const cleanId = id.includes(":") ? id.split(":").slice(1).join("-") : id;
  const normalizedId = cleanId.replace(/[._]/g, "-");
  const bundle = getBundle(locale) ?? getBundle(FALLBACK_LOCALE);
  if (!bundle) {
    console.log(`[Fluent] No bundle found for ${locale}`);
    return id;
  }
  const activeBundle = bundle.hasMessage(normalizedId) ? bundle : getBundle(FALLBACK_LOCALE);
  if (!activeBundle) return id;
  if (!activeBundle.hasMessage(normalizedId)) {
    console.log(`[Fluent] Key NOT found: "${normalizedId}" (original: "${id}")`);
  }
  const msg = activeBundle.getMessage(normalizedId);
  if (!msg) {
    console.log(`[Fluent] Message object not found for ${normalizedId}`);
    return id;
  }
  if (!msg.value) {
    console.log(`[Fluent] Message value is null for ${normalizedId}`);
    return id;
  }
  const extendedArgs = {
    ...args,
    personality: ctx?.personality.type ?? "casual",
    intensity: ctx?.personality.intensity ?? "normal",
    emotion: ctx?.emotion ?? "happy",
    streak: ctx?.streak ?? 1
  };
  const formatted = activeBundle.formatPattern(msg.value, extendedArgs);
  return applyContext(formatted, id, ctx);
}
function getT(locale, ctx) {
  return (id, args) => t(locale, id, args, ctx);
}

// src/i18n/context/mapper.ts
function toI18nContext(ctx) {
  return {
    userId: ctx.user.id,
    guildId: ctx.guild?.id,
    locale: ctx.locale,
    isGuild: !!ctx.guild,
    isDM: !ctx.guild,
    hour: (/* @__PURE__ */ new Date()).getHours(),
    isAdmin: ctx.isAdmin,
    isNewUser: false,
    command: ctx.command,
    personality: ctx.personality,
    emotion: ctx.emotion,
    streak: ctx.streak
  };
}

// src/i18n/fluent/createT.ts
function createT(ctx) {
  return (key, args) => {
    const i18nCtx = toI18nContext(ctx);
    const baseT = getT(i18nCtx.locale, i18nCtx);
    return baseT(key, args);
  };
}

// src/utils/runCommand.ts
import { Message as Message3 } from "discord.js";

// src/utils/CommandTracker.ts
import { Collection } from "discord.js";
var CommandTracker = class {
  history = new Collection();
  EXPIRY_MS = 6e4;
  // 1 minute
  recordAndGetCount(userId, commandName) {
    const now = Date.now();
    const userHistory = this.history.get(userId);
    if (!userHistory || now - userHistory.lastTimestamp > this.EXPIRY_MS) {
      this.history.set(userId, {
        lastCommand: commandName,
        count: 1,
        lastTimestamp: now
      });
      return 1;
    }
    if (userHistory.lastCommand === commandName) {
      userHistory.count++;
      userHistory.lastTimestamp = now;
      return userHistory.count;
    } else {
      userHistory.lastCommand = commandName;
      userHistory.count = 1;
      userHistory.lastTimestamp = now;
      return 1;
    }
  }
};
var commandTracker = new CommandTracker();

// src/utils/runCommand.ts
async function runCommand_default(rawContext, command) {
  const userId = rawContext instanceof Message3 ? rawContext.author.id : rawContext.user.id;
  const settings = await db.getUserSettings(userId);
  const guildSettings = rawContext.guildId ? await db.getGuildSettings(rawContext.guildId) : null;
  const repeatCount = commandTracker.recordAndGetCount(userId, command.name);
  const ctx = new Context(
    rawContext,
    settings?.language,
    guildSettings?.personality,
    guildSettings?.emotion,
    repeatCount
  );
  if (repeatCount >= 5) {
    ctx.emotion = "frustration";
  } else if (repeatCount >= 3) {
    ctx.emotion = "annoyed";
  }
  const t2 = createT(ctx);
  try {
    await commandPipeline(ctx, command, t2);
    if (ctx.emotion === "happy" || ctx.emotion === "neutral") {
      ctx.emotion = "joy";
    }
  } catch (error) {
    ctx.emotion = "frustration";
    await ErrorHandler.handle(error, ctx, t2, {
      command: command.name
    });
  }
}

export {
  runCommand_default
};
