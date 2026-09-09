import { addCommandMethodMetadata, setCommandMetadata, type CommandMethodMetadata } from './metadata';
import type { CommandMetadata } from './types';

export function Command(metadata: CommandMetadata) {
    return function <T extends abstract new (...args: never[]) => object>(
        _target: T,
        context: ClassDecoratorContext<T>,
    ): void {
        if (context.kind !== 'class') {
            throw new TypeError('@Command can only decorate a class');
        }
        setCommandMetadata(context.metadata as Record<PropertyKey, unknown>, metadata);
    };
}

export function command(metadata: CommandMetadata) {
    return function <This, Args extends unknown[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
    ): (this: This, ...args: Args) => Return {
        if (context.static) {
            throw new TypeError('@command cannot decorate a static method');
        }
        const value: CommandMethodMetadata = {
            ...metadata,
            method: context.name,
        };
        addCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, value);
        return target;
    };
}
