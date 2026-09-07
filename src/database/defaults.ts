import config from '@/config.json';
import type { GuildSettings } from '@/guilds/types';

export const DEFAULT_GUILD_SETTINGS: GuildSettings = {
    guildId: '',
    prefix: config.bot_prefix,
    language: config.defaultLanguage,
    defaultCooldown: 1500,
    roleCooldowns: {},
    disabledCommands: [],
    personality: {
        type: 'casual',
        intensity: 'normal',
    },
    emotion: 'happy',
};
