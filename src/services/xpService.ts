import { db } from '@/databases';
import type { Message } from 'discord.js';

type XpResult = {
    leveledUp: boolean;
    newLevel: number;
} | null;

const cooldowns = new Map<string, number>();
const COOLDOWN = 45 * 1000;

export async function handleMessage(message: Message): Promise<XpResult> {
    const userId = message.author.id;
    const now = Date.now();

    const last = cooldowns.get(userId) || 0;
    if (now - last < COOLDOWN) return null;
    cooldowns.set(userId, now);

    const content = message.cleanContent;
    if (!content || content.length < 5) return null;

    if (/^[^a-zA-Z0-9]+$/.test(content)) return null;

    const lastMsgKey = `${userId}:lastMsg`;
    if ((global as any)[lastMsgKey] === content) return null;
    (global as any)[lastMsgKey] = content;

    const words = content.split(/\s+/).length;
    const letters = content.replace(/\s+/g, '').length;

    const xp =
        Math.floor(5 * (words / 30 + letters / 30 / 6)) +
        Math.floor(Math.random() * 5);

    if (xp <= 0) return null;

    const before = (await db.getUserProfile(userId)) as any;
    const oldLevel = before?.[0]?.level || 1;

    await db.addExperience(userId, xp);

    const after = (await db.getUserProfile(userId)) as any;
    const newLevel = after?.[0]?.level || 1;

    return { leveledUp: newLevel > oldLevel, newLevel };
}
