"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Experience = void 0;
class Experience {
    static CONSTANT = 50;
    static getLevel(xp) {
        if (xp <= 0)
            return 1;
        return Math.floor(Math.sqrt(xp / this.CONSTANT)) + 1;
    }
    static getXPForLevel(level) {
        if (level <= 1)
            return 0;
        const targetLevel = level - 1;
        return this.CONSTANT * (targetLevel * targetLevel);
    }
    static getLevelProgress(xp) {
        const level = this.getLevel(xp);
        const currentLevelStartXP = this.getXPForLevel(level);
        const nextLevelStartXP = this.getXPForLevel(level + 1);
        const progressInLevel = xp - currentLevelStartXP;
        const neededInLevel = nextLevelStartXP - currentLevelStartXP;
        const percentage = Math.min(Math.floor((progressInLevel / neededInLevel) * 100), 100);
        return {
            level,
            progressInLevel,
            neededInLevel,
            percentage,
            totalXP: xp
        };
    }
    static getProgressBar(xp, length = 10) {
        const { percentage } = this.getLevelProgress(xp);
        const filledLength = Math.round((length * percentage) / 100);
        const emptyLength = length - filledLength;
        return '#'.repeat(filledLength) + ' '.repeat(emptyLength);
    }
}
exports.Experience = Experience;
