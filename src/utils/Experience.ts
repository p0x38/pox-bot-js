export class Experience {
    private static readonly CONSTANT = 50;

    static getLevel(xp: number): number {
        if (xp <= 0) return 1;
        return Math.floor(Math.sqrt(xp / this.CONSTANT)) + 1;
    }

    static getXPForLevel(level: number): number {
        if (level <= 1) return 0;
        const targetLevel = level - 1;
        return this.CONSTANT * (targetLevel * targetLevel);
    }

    static getLevelProgress(xp: number) {
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
        }
    }

    static getProgressBar(xp: number, length: number = 10): string {
        const { percentage } = this.getLevelProgress(xp);
        const filledLength = Math.round((length * percentage) / 100);
        const emptyLength = length - filledLength;

        return '#'.repeat(filledLength) + ' '.repeat(emptyLength);
    }
}