import type { TFunction } from 'i18next';

import type { Command } from '@/commands/types';
import type { Context } from '@/contexts/Context';

export type Middleware = (
    ctx: Context,
    command: Command,
    t: TFunction,
    next: () => Promise<void>,
) => Promise<void>;
