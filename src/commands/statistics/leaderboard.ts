import { EmbedBuilder } from 'discord.js';
import { db } from '@/databases';
import { Command } from '@/types';

const command: Command = {
    name: 'leaderboard',
    description: 'Check the top XP earners in this server!',
    guildOnly: true,

    execute: async (context, t) => {
        const topUsers = await db.getTopUsers(10);

        if (!topUsers || topUsers.length === 0) {
            await context.reply({
                content: t('messages:commands.leaderboard.empty', {
                    defaultValue: 'No users found on the leaderboard yet!',
                }),
            });
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle(
                t('commands:leaderboard.title', {
                    defaultValue: 'Global leaderboard',
                }),
            )
            .setColor(0xfee75c)
            .setDescription(
                topUsers
                    .map((u, index) => {
                        const rank = `**#${index + 1}**`;
                        return `${rank} <@${u.user_id}> - **Lv.${u.level}** (\`${Number(u.xp).toLocaleString()} XP\`)`;
                    })
                    .join('\n\n'),
            )
            .setTimestamp();

        await context.reply({ embeds: [embed] });
    },
};

export default command;
