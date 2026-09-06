import { Context } from '@/contexts/Context';

import { getT } from './t';
import { toI18nContext } from '../context/mapper';

export function createT(ctx: Context) {
    return (key: string, args?: Record<string, any>) => {
        const i18nCtx = toI18nContext(ctx);
        const baseT = getT(i18nCtx.locale, i18nCtx);
        return baseT(key, args);
    };
}
