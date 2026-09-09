import { addCommandMethodMetadata } from './metadata';

type ExecuteMethod = (
    target: unknown,
    context: ClassMethodDecoratorContext,
) => void;

export function Execute(): ExecuteMethod {
    return function executeDecorator(target, context): void {
        if (context.kind !== 'method') {
            throw new TypeError('@Execute can only decorate a method');
        }
        if (context.static) {
            throw new TypeError('@Execute cannot decorate a static method');
        }

        addCommandMethodMetadata(context.metadata as Record<PropertyKey, unknown>, {
            method: context.name,
            execute: true,
        });
    };
}

export const execute = Execute;
