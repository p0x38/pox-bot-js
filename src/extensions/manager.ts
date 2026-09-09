import type { Extension, ExtensionManagerLike } from './types';

export class ExtensionManager implements ExtensionManagerLike {
    readonly #extensions = new Map<string, Extension>();

    get size(): number {
        return this.#extensions.size;
    }

    has(name: string): boolean {
        return this.#extensions.has(name);
    }

    get(name: string): Extension | undefined {
        return this.#extensions.get(name);
    }

    register(extension: Extension): void {
        if (this.#extensions.has(extension.name)) {
            throw new Error(`Extension already registered: ${extension.name}`);
        }
        this.#extensions.set(extension.name, extension);
    }

    async setupAll(): Promise<void> {
        for (const extension of this.#extensions.values()) {
            await extension.setup?.(this);
        }
    }

    async teardownAll(): Promise<void> {
        const extensions = [...this.#extensions.values()].reverse();
        for (const extension of extensions) {
            await extension.teardown?.(this);
        }
    }
}
