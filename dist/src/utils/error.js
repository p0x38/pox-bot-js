"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandInvokeError = exports.DatabaseError = exports.InternalError = exports.MissingRequiredArgument = exports.BadArgument = exports.UserInputError = exports.CommandDisabled = exports.NoPrivateMessage = exports.BotMissingPermissions = exports.MissingPermissions = exports.NotOwner = exports.Forbidden = exports.CheckFailure = exports.CommandError = exports.BotError = void 0;
class BotError extends Error {
    i18nKey;
    args;
    constructor(i18nKey, args = {}) {
        super(i18nKey);
        this.i18nKey = i18nKey;
        this.args = args;
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}
exports.BotError = BotError;
class CommandError extends BotError {
}
exports.CommandError = CommandError;
class CheckFailure extends CommandError {
}
exports.CheckFailure = CheckFailure;
class Forbidden extends CheckFailure {
}
exports.Forbidden = Forbidden;
class NotOwner extends Forbidden {
    constructor() { super('errors:not_owner'); }
}
exports.NotOwner = NotOwner;
class MissingPermissions extends CheckFailure {
    constructor(perms, i18nKey = 'errors:missing_permissions', args = {}) {
        super(i18nKey, { perms: perms.join(', '), ...args });
    }
}
exports.MissingPermissions = MissingPermissions;
class BotMissingPermissions extends MissingPermissions {
    constructor(perms) {
        super(perms, 'errors:bot_missing_permissions');
    }
}
exports.BotMissingPermissions = BotMissingPermissions;
class NoPrivateMessage extends CheckFailure {
    constructor() {
        super('errors:guild_only');
    }
}
exports.NoPrivateMessage = NoPrivateMessage;
class CommandDisabled extends CheckFailure {
    constructor() {
        super('errors:command_disabled');
    }
}
exports.CommandDisabled = CommandDisabled;
class UserInputError extends CommandError {
}
exports.UserInputError = UserInputError;
class BadArgument extends UserInputError {
    constructor(expected, got) {
        super('errors:bad_argument', { expected, got });
    }
}
exports.BadArgument = BadArgument;
class MissingRequiredArgument extends UserInputError {
    constructor(argName) {
        super('errors:missing_arg', { argName });
    }
}
exports.MissingRequiredArgument = MissingRequiredArgument;
class InternalError extends BotError {
}
exports.InternalError = InternalError;
class DatabaseError extends InternalError {
    constructor(detail) {
        super('errors:database_error', { detail: detail || 'Internal DB Error' });
    }
}
exports.DatabaseError = DatabaseError;
class CommandInvokeError extends InternalError {
    constructor(originalError) {
        super('errors:command_invoke_error', { message: originalError.message });
    }
}
exports.CommandInvokeError = CommandInvokeError;
