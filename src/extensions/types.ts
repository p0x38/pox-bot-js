export interface Extension {
    readonly name: string;
    readonly setup?: (manager: unknown) => void | Promise<void>;
    readonly teardown?: (manager: unknown) => void | Promise<void>;
}
