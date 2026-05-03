"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemberConverter = void 0;
class MemberConverter {
    static async convert(message, value) {
        const id = value.match(/\d+/)?.[0];
        if (!id || !message.guild)
            return undefined;
        return await message.guild?.members.fetch(id).catch(() => undefined);
    }
}
exports.MemberConverter = MemberConverter;
