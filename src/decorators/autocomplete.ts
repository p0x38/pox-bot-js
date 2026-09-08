import { setCommandMethodMetadata } from './metadata';

export function autocomplete(
    _target: unknown,
    context: ClassMethodDecoratorContext,
): void {
    if (context.static) {
        throw new TypeError('@autocomplete cannot decorate a static method');
    }

    setCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, {
        autocomplete: context.name,
    });
}
