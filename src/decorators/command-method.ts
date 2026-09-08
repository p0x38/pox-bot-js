import { setCommandMethodMetadata } from './metadata';

export function commandMethod(
    metadata: { execute?: string | symbol; autocomplete?: string | symbol },
) {
    return function (
        _target: unknown,
        context: ClassMethodDecoratorContext,
    ): void {
        if (context.static) {
            throw new TypeError('@commandMethod cannot decorate a static method');
        }

        setCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, metadata);
    };
}
