import type { Context } from '@/contexts/Context';

import { Command } from '../types';

const setcolor: Command = {
    name: 'setcolor',
    description: 'Set your profile color.',
    guildOnly: false,

    execute: async (_context: Context) => {
        // TODO: Implement setcolor
        return {
            key: 'messages-commands-setcolor-success',
            vars: { defaultValue: 'Color updated!' },
            emotion: 'joy',
        };
    },
};

export default setcolor;
