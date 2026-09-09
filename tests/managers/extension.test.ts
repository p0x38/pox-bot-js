import assert from 'node:assert/strict';
import test from 'node:test';

import type { Extension } from '@/extensions/types';
import { ExtensionManager } from '@/managers/extension';

test('registers and retrieves extensions', () => {
    const manager = new ExtensionManager();
    const extension: Extension = { name: 'commands' };

    manager.register(extension);

    assert.equal(manager.size, 1);
    assert.equal(manager.has('commands'), true);
    assert.equal(manager.get('commands'), extension);
    assert.equal(manager.get('missing'), undefined);
});

test('rejects duplicate extension names', () => {
    const manager = new ExtensionManager();

    manager.register({ name: 'commands' });

    assert.throws(
        () => manager.register({ name: 'commands' }),
        /Extension already registered: commands/,
    );
});

test('sets up extensions in registration order', async () => {
    const manager = new ExtensionManager();
    const calls: string[] = [];

    manager.register({
        name: 'first',
        setup: async (receivedManager) => {
            assert.equal(receivedManager, manager);
            calls.push('first');
        },
    });
    manager.register({
        name: 'second',
        setup: async (receivedManager) => {
            assert.equal(receivedManager, manager);
            calls.push('second');
        },
    });

    await manager.setupAll();

    assert.deepEqual(calls, ['first', 'second']);
});

test('tears down extensions in reverse registration order', async () => {
    const manager = new ExtensionManager();
    const calls: string[] = [];

    manager.register({
        name: 'first',
        teardown: async (receivedManager) => {
            assert.equal(receivedManager, manager);
            calls.push('first');
        },
    });
    manager.register({
        name: 'second',
        teardown: async (receivedManager) => {
            assert.equal(receivedManager, manager);
            calls.push('second');
        },
    });

    await manager.teardownAll();

    assert.deepEqual(calls, ['second', 'first']);
});
