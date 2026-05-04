import { Events } from 'discord.js';
import { BotEvent } from './event';
import logger from '../logger';

const event: BotEvent<Events.Error> = {
    name: Events.Error,
    execute(error: Error) {
        logger.error('Discord client raised error:', error);
    },
};

export default event;
