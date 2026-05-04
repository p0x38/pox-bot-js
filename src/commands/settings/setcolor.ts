import { TFunction } from '@/i18n/fluent/t';
import { Command } from '../../types';
import type { Context } from '@/contexts/Context';

const setcolor: Command = {
    name: 'setcolor',
    description: 'Set your profile color.',
    guildOnly: false,

    execute: async (context: Context) => {
        // TODO: Implement setcolor
        return {
            key: 'messages-commands-setcolor-success',
            vars: { defaultValue: 'Color updated!' },
            emotion: 'joy',
        };
    },
};

export default setcolor;
