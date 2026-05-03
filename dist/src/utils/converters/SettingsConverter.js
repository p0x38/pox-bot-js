"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsConverter = void 0;
const database_1 = require("../../database");
class SettingsConverter {
    static async convert(message, value) {
        const id = value.match(/\d+/)?.[0] || message.author.id;
        return await database_1.db.getUserSettings(id);
    }
}
exports.SettingsConverter = SettingsConverter;
