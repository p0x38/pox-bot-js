import {
    setCommandMetadata,
    type CommandMetadata,
} from './metadata';

export function command(metadata: CommandMetadata) {
    return function <T extends abstract new (...args: never[]) => object>(
        _target: T,
        context: ClassDecoratorContext<T>,
    ): void {
        if (context.kind !== 'class') {
            throw new TypeError('@command can only decorate a class');
        }

        setCommandMetadata(context.metadata as Record<PropertyKey, unknown>, metadata);
    };
}
