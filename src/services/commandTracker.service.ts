import { Collection } from 'discord.js';

interface CommandHistory {
    lastCommand: string;
    count: number;
    lastTimestamp: number;
}

class CommandTracker {
    private history = new Collection<string, CommandHistory>();
    private readonly EXPIRY_MS = 60000; // 1 minute

    public recordAndGetCount(userId: string, commandName: string): number {
        const now = Date.now();
        const userHistory = this.history.get(userId);

        if (!userHistory || now - userHistory.lastTimestamp > this.EXPIRY_MS) {
            this.history.set(userId, {
                lastCommand: commandName,
                count: 1,
                lastTimestamp: now,
            });
            return 1;
        }

        if (userHistory.lastCommand === commandName) {
            userHistory.count++;
            userHistory.lastTimestamp = now;
            return userHistory.count;
        } else {
            userHistory.lastCommand = commandName;
            userHistory.count = 1;
            userHistory.lastTimestamp = now;
            return 1;
        }
    }
}

export const commandTracker = new CommandTracker();
