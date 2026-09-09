import { setCogMetadata, type CogMetadata } from './metadata';

export function cog(metadata: CogMetadata) {
    return function <T extends abstract new (...args: never[]) => object>(
        _target: T,
        context: ClassDecoratorContext<T>,
    ): void {
        if (context.kind !== 'class') {
            throw new TypeError('@cog can only decorate a class');
        }

        setCogMetadata(context.metadata as Record<PropertyKey, unknown>, metadata);
    };
}
