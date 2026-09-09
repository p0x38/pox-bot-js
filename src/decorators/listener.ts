import { addListenerMethodMetadata } from './metadata';

export function listener(event: string, options: { once?: boolean } = {}) {
    return function <This, Args extends unknown[], Return>(
        target: (this: This, ...args: Args) => Return,
        context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>,
    ): (this: This, ...args: Args) => Return {
        if (context.static) {
            throw new TypeError('@listener cannot decorate a static method');
        }
        addListenerMethodMetadata(context.metadata as Record<PropertyKey, unknown>, {
            event,
            method: context.name,
            once: options.once ?? false,
        });
        return target;
    };
}

export function Listener(event: string, options?: { once?: boolean }) {
    return listener(event, options);
}
