import { TFunction } from "i18next";
import { Command, CommandContext, ParsedArgs } from "../types";
import { Guards } from "./guards";
import { ErrorHandler } from "./ErrorHandler";
import { ArgumentParser } from "./parser";

export default async function (context: CommandContext, command: Command, t: TFunction) {
    try {
        Guards.checkCommandEnabled(command.name);

        if (command.ownerOnly) Guards.ownerOnly(context);
        if (command.guildOnly) Guards.guildOnly(context);
        if (command.permissions) Guards.hasPermissions(context, command.permissions);
        if (command.botPermissions) Guards.botHasPermissions(context, command.botPermissions);

        let parsedArgs: ParsedArgs = {};
        if (command.args) {
            parsedArgs = await ArgumentParser.parse(context, command.args);
        }

        await command.execute(context, t, parsedArgs);
    } catch (error) {
        await ErrorHandler.handle(error, context, t);
    }
}