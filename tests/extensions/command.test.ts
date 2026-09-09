import assert from 'node:assert/strict';
import test from 'node:test';

import { Command, Execute } from '@/decorators';
import { createCommandExtension } from '@/extensions/command';

@Command({
    name: 'test',
    description: 'A test command',
})
class TestCommand {
    @Execute()
    async execute() {
        return 'ok';
    }
}

test('creates commands from decorated classes', async () => {
    const extension = createCommandExtension([TestCommand]);

    assert.equal(extension.name, 'commands');
    assert.equal(extension.classes[0], TestCommand);
    assert.equal(extension.commands[0]?.name, 'test');
    assert.equal(extension.commands[0]?.description, 'A test command');
    assert.equal(await extension.commands[0]?.execute({} as never, {} as never, {}), 'ok');
});

test('rejects classes without @Command', () => {
    class MissingCommand {
        @Execute()
        execute() {}
    }

    assert.throws(() => createCommandExtension([MissingCommand]), /missing @Command/);
});
