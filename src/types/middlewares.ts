import type { Context } from '@/contexts/Context';
import type { Command } from '@/types';
import type { TFunction } from 'i18next';

export type Middleware = (
    ctx: Context,
    command: Command,
    t: TFunction,
    next: () => Promise<void>,
) => Promise<void>;
