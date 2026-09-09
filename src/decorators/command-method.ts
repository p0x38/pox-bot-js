import { setCommandMethodMetadata } from './metadata';

export function commandMethod(
    metadata: Parameters<typeof setCommandMethodMetadata>[1],
) {
    return function <This, Args extends unknown[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<
            This,
            (this: This, ...args: Args) => Return
        >,
    ): (this: This, ...args: Args) => Return {
        if (context.static) {
            throw new TypeError('@commandMethod cannot decorate a static method');
        }

        setCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, metadata);
        return target;
    };
}
