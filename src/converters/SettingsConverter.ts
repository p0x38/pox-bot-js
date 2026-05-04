import { db } from '../databases';
import type { Context } from '@/contexts/Context';

export class SettingsConverter {
    static async convert(ctx: Context, value: string) {
        const id = value.match(/\d+/)?.[0] ?? ctx.user.id;

        return await db.getUserSettings(id);
    }
}
