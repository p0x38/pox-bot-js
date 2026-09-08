import { setCommandMetadata } from './metadata';

export function description(value: string) {
    return function (
        _target: unknown,
        context: ClassDecoratorContext,
    ): void {
        setCommandMetadata(context.metadata as Record<PropertyKey, unknown>, {
            name: '',
            description: value,
        });
    };
}
