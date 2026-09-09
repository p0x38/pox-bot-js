import { addCommandMethodMetadata } from './metadata';

export function commandMethod(
    metadata: Parameters<typeof addCommandMethodMetadata>[1],
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

        addCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, {
            ...metadata,
            method: context.name,
        });
        return target;
    };
}
