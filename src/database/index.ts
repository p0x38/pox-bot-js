import { guildRepo } from './guild.repo';
import { runMigrations } from './migration';
import { pool } from './pool';
import { userRepo } from './user.repo';

export { pool, runMigrations };

export const db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
    pool,

    // User
    getUserStats: userRepo.getUserStats.bind(userRepo),
    getUserSettings: userRepo.getUserSettings.bind(userRepo),
    updateSetting: userRepo.updateSetting.bind(userRepo),
    addExperience: userRepo.addExperience.bind(userRepo),
    getUserProfile: userRepo.getUserProfile.bind(userRepo),
    getTopUsers: userRepo.getTopUsers.bind(userRepo),

    // Guild
    getGuildSettings: guildRepo.getGuildSettings.bind(guildRepo),
    updateGuildSetting: guildRepo.updateGuildSetting.bind(guildRepo),

    // Migrations
    runMigrations,
};
