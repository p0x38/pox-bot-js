"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const guards_1 = require("./guards");
const ErrorHandler_1 = require("./ErrorHandler");
const parser_1 = require("./parser");
async function default_1(context, command, t) {
    try {
        guards_1.Guards.checkCommandEnabled(command.name);
        if (command.ownerOnly)
            guards_1.Guards.ownerOnly(context);
        if (command.guildOnly)
            guards_1.Guards.guildOnly(context);
        if (command.permissions)
            guards_1.Guards.hasPermissions(context, command.permissions);
        if (command.botPermissions)
            guards_1.Guards.botHasPermissions(context, command.botPermissions);
        let parsedArgs = {};
        if (command.args) {
            parsedArgs = await parser_1.ArgumentParser.parse(context, command.args);
        }
        await command.execute(context, t, parsedArgs);
    }
    catch (error) {
        await ErrorHandler_1.ErrorHandler.handle(error, context, t);
    }
}
