import { Events } from 'discord.js';

import { logger } from '@/logger';

import { BotEvent } from './event';

const event: BotEvent<Events.Error> = {
    name: Events.Error,
    execute(error: Error) {
        logger.error('Discord client raised error:', error);
    },
};

export default event;
