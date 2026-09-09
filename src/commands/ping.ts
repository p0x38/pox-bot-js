import { Command, Execute } from '@/decorators';
import type { CommandContext } from './types';

@Command({
    name: 'ping',
    description: 'Check the bot latency',
})
export class PingCommand {
    @Execute()
    async execute(ctx: CommandContext) {
        return `Pong! ${ctx.client.ws.ping}ms`;
    }
}
