export interface CommandContext {
    commandName: string;
    subcommand?: string;
    interactionType: 'slash' | 'prefix' | 'button' | 'modal';
}
