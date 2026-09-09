import assert from 'node:assert/strict';
import test from 'node:test';

import { Command, cog, command, listener } from '@/decorators';
import { Cog, createCogExtension } from '@/extensions/cog';

test('builds multiple commands from a cog', async () => {
    @cog({ name: 'info', description: 'Information commands' })
    class InfoCog extends Cog {
        constructor() {
            super('info', 'Information commands');
        }

        @command({ name: 'ping', description: 'Ping the bot' })
        async ping() {
            return 'pong';
        }

        @command({ name: 'hello', description: 'Say hello' })
        async hello() {
            return 'hello';
        }
    }

    const extension = createCogExtension(InfoCog);

    assert.equal(extension.name, 'info');
    assert.equal(extension.commands.length, 2);
    assert.equal(await extension.commands[0]?.execute({} as never, {} as never, {}), 'pong');
    assert.equal(await extension.commands[1]?.execute({} as never, {} as never, {}), 'hello');
});

test('registers listener decorators on a client', () => {
    @cog({ name: 'events' })
    class EventsCog extends Cog {
        constructor() {
            super('events');
        }

        @listener('ready', { once: true })
        onReady() {}
    }

    const calls: string[] = [];
    const client = {
        once(event: string, handler: () => void) { calls.push(`once:${event}:${typeof handler}`); },
        on() { throw new Error('unexpected on registration'); },
    } as never;

    createCogExtension(EventsCog, client);
    assert.deepEqual(calls, ['once:ready:function']);
});

test('keeps legacy @Command classes usable', () => {
    @Command({ name: 'legacy', description: 'Legacy command' })
    class LegacyCommand {
        execute() { return 'ok'; }
    }

    assert.ok(LegacyCommand[Symbol.metadata]);
});
