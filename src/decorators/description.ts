import { setCommandMetadata } from './metadata';

export function description(value: string) {
    return function <T extends abstract new (...args: never[]) => object>(
        _target: T,
        context: ClassDecoratorContext<T>,
    ): void {
        if (context.kind !== 'class') {
            throw new TypeError('@description can only decorate a class');
        }

        const metadata = context.metadata as Record<PropertyKey, unknown>;
        const current = metadata['command'] as Record<string, unknown> | undefined;
        setCommandMetadata(metadata, {
            name: typeof current?.name === 'string' ? current.name : '',
            description: value,
        });
    };
}
