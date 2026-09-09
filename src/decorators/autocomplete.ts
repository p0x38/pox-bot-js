import { addCommandMethodMetadata } from './metadata';

export function autocomplete(
    _target: unknown,
    context: ClassMethodDecoratorContext,
): void {
    if (context.static) {
        throw new TypeError('@autocomplete cannot decorate a static method');
    }

    addCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, {
        method: context.name,
        autocomplete: true,
    });
}
