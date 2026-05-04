import { db } from '../databases';
import type { Context } from '@/contexts/Context';
import { BaseConverter } from './BaseConverter';

export class SettingsConverter extends BaseConverter<any> {
    readonly name = 'Settings';

    async convert(ctx: Context, value: string) {
        const id = value.match(/\d+/)?.[0] ?? ctx.user.id;
        return await db.getUserSettings(id);
    }
}
