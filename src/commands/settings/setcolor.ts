import { TFunction } from '@/i18n/fluent/t';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';

const setcolor: Command = {
    name: 'setcolor',
    description: 'Set your profile color.',
    guildOnly: false,

    execute: async (context: Context, t: TFunction) => {
        // TODO: Implement setcolor
        const msg = t('messages:commands.setcolor.success', {
            defaultValue: 'Color updated!',
        });
        await context.reply(msg);
    },
};

export default setcolor;
