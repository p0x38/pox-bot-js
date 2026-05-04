export class BotError extends Error {
    constructor(
        public i18nKey: string,
        public args: Record<string, any> = {},
    ) {
        super(i18nKey);
        this.name = this.constructor.name;
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class CommandError extends BotError {}

export class CheckFailure extends CommandError {}

export class Forbidden extends CheckFailure {}

export class NotOwner extends Forbidden {
    constructor() {
        super('errors:not_owner');
    }
}

export class MissingPermissions extends CheckFailure {
    constructor(
        perms: string[],
        i18nKey: string = 'errors:missing_permissions',
        args: Record<string, any> = {},
    ) {
        super(i18nKey, { perms: perms.join(', '), ...args });
    }
}

export class BotMissingPermissions extends MissingPermissions {
    constructor(perms: string[]) {
        super(perms, 'errors:bot_missing_permissions');
    }
}

export class NoPrivateMessage extends CheckFailure {
    constructor() {
        super('errors:guild_only');
    }
}

export class CommandDisabled extends CheckFailure {
    constructor() {
        super('errors:command_disabled');
    }
}

export class UserInputError extends CommandError {}

export class BadArgument extends UserInputError {
    constructor(expected: string, got: string) {
        super('errors:bad_argument', { expected, got });
    }
}

export class MissingRequiredArgument extends UserInputError {
    constructor(argName: string) {
        super('errors:missing_arg', { argName });
    }
}

export class InternalError extends BotError {}

export class DatabaseError extends InternalError {
    constructor(detail?: string) {
        super('errors:database_error', {
            detail: detail || 'Internal DB Error',
        });
    }
}

export class CommandInvokeError extends InternalError {
    constructor(originalError: Error) {
        super('errors:command_invoke_error', {
            message: originalError.message,
        });
    }
}
