import { DEFAULT_BOT_PREFIX, DEFAULT_LANGUAGE } from '@/config/defaults';
import type { GuildSettings } from '@/guilds/types';

export const DEFAULT_GUILD_SETTINGS: GuildSettings = {
    guildId: '',
    prefix: DEFAULT_BOT_PREFIX,
    language: DEFAULT_LANGUAGE,
    defaultCooldown: 1500,
    roleCooldowns: {},
    disabledCommands: [],
    personality: {
        type: 'casual',
        intensity: 'normal',
    },
    emotion: 'happy',
};
