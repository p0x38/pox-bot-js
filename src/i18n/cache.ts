const cache = new Map<string, unknown>();

export function getCache<T>(key: string, factory: () => T): T {
    if (cache.has(key)) return cache.get(key) as T;

    const value = factory();
    cache.set(key, value);

    return value;
}

export function clearCache() {
    cache.clear();
}
