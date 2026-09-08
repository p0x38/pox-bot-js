import { setCommandMethodMetadata } from './metadata';

export function execute<This, Args extends unknown[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
): (this: This, ...args: Args) => Return {
    if (context.static) {
        throw new TypeError('@execute cannot decorate a static method');
    }

    setCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, {
        execute: context.name,
    });

    return target;
}
