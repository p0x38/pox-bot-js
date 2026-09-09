export interface ExtensionManagerLike {
    readonly size: number;
    has(name: string): boolean;
    get(name: string): Extension | undefined;
}

export interface Extension {
    readonly name: string;
    readonly setup?: (manager: ExtensionManagerLike) => void | Promise<void>;
    readonly teardown?: (manager: ExtensionManagerLike) => void | Promise<void>;
}
