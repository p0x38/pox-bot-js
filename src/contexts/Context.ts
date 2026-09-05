import { RawContext } from '@/types/index';
import {
    Message,
    ChatInputCommandInteraction,
    MessageFlags,
    PermissionFlagsBits,
    type InteractionReplyOptions,
    type MessageCreateOptions,
    type MessageEditOptions,
    GuildMember,
    type User,
    type Guild,
    type TextBasedChannel,
    type Client,
} from 'discord.js';
import type { CommandContext } from '@/i18n/context/command';
import type { ContextMetadata } from './ContextMetadata';
import type { EmotionType, Personality } from '@/i18n/context/types';

type ReplyOptions = {
    content?: string;
    embeds?: InteractionReplyOptions['embeds'];
    components?: InteractionReplyOptions['components'];
    ephemeral?: boolean;
    deleteAfter?: number;
};

type ReplyInput = string | ReplyOptions;

export function isMessage(ctx: unknown): ctx is Message {
    return ctx instanceof Message;
}

export function resolveLocale(raw: RawContext, dbLocale?: string): string {
    if (dbLocale) return dbLocale;

    if (raw instanceof ChatInputCommandInteraction) {
        return raw.locale;
    }

    if (raw.guild?.preferredLocale) {
        return raw.guild.preferredLocale;
    }

    return 'en';
}

export class Context {
    public readonly raw: RawContext;
    public readonly metadata: ContextMetadata;

    constructor(ctx: RawContext, metadata: ContextMetadata) {
        if (ctx instanceof Context) {
            throw new Error('Context cannot wrap another Context');
        }

        this.raw = ctx;

        this.metadata = metadata;
    }

    get locale(): string {
        return this.metadata.locale;
    }

    get personality(): Personality {
        return this.metadata.personality;
    }

    set personality(value: Personality) {
        this.metadata.setPersonality(value);
    }

    get emotion(): EmotionType {
        return this.metadata.emotion;
    }

    set emotion(value: EmotionType) {
        this.metadata.setEmotion(value);
    }

    get streak(): number {
        return this.metadata.streak;
    }

    set streak(value: number) {
        this.metadata.streak = value;
    }

    get user(): User {
        return this.raw instanceof Message ? this.raw.author : this.raw.user;
    }

    get guild(): Guild | null {
        return this.raw.guild;
    }

    get channel(): TextBasedChannel | null {
        return this.raw.channel;
    }

    get client(): Client {
        return this.raw.client;
    }

    get member(): GuildMember | null {
        if (!this.guild) return null;

        if (this.raw instanceof Message) {
            return this.raw.member;
        }

        return this.raw.member instanceof GuildMember ? this.raw.member : null;
    }

    get interaction(): ChatInputCommandInteraction | null {
        return this.raw instanceof ChatInputCommandInteraction
            ? this.raw
            : null;
    }

    get isAdmin(): boolean {
        return (
            this.member?.permissions.has(PermissionFlagsBits.Administrator) ??
            false
        );
    }

    get interactionType(): CommandContext['interactionType'] {
        return this.raw instanceof ChatInputCommandInteraction
            ? 'slash'
            : 'prefix';
    }

    get command(): CommandContext | undefined {
        if (this.raw instanceof ChatInputCommandInteraction) {
            return {
                commandName: this.raw.commandName,
                subcommand: this.raw.options.getSubcommand(false) ?? undefined,
                interactionType: 'slash',
            };
        }

        return undefined;
    }

    get replied(): boolean {
        return this.interaction?.replied ?? false;
    }

    get deferred(): boolean {
        return this.interaction?.deferred ?? false;
    }

    get options() {
        return this.interaction?.options ?? null;
    }

    async reply(input: ReplyInput): Promise<Message | void> {
        const options: ReplyOptions =
            typeof input === 'string' ? { content: input } : input;

        const { content, embeds, components, ephemeral, deleteAfter } = options;

        if (this.raw instanceof Message) {
            const msgOptions: MessageCreateOptions = {
                content,
                embeds,
                components,
            };
            const sent: Message = await this.raw.reply(msgOptions);

            if (deleteAfter) this.safeDelete(sent, deleteAfter);
            return sent;
        }

        const interactionOptions: InteractionReplyOptions = {
            content,
            embeds,
            components,
        };

        if (ephemeral) {
            interactionOptions.flags = MessageFlags.Ephemeral;
        }

        const sent =
            this.raw.replied || this.raw.deferred
                ? await this.raw.followUp(interactionOptions)
                : await this.raw.reply(interactionOptions);

        if (deleteAfter && !ephemeral && 'delete' in sent) {
            this.safeDelete(sent, deleteAfter);
        }

        return;
    }

    async defer(ephemeral = false): Promise<void> {
        if (!(this.raw instanceof ChatInputCommandInteraction)) return;

        if (!this.raw.deferred && !this.raw.replied) {
            await this.raw.deferReply({
                flags: ephemeral ? MessageFlags.Ephemeral : undefined,
            });
        }
    }

    async edit(options: ReplyOptions): Promise<Message | void> {
        const { content, embeds, components } = options;

        if (this.raw instanceof Message) {
            return this.raw.edit({ content, embeds, components });
        }

        const editOptions: MessageEditOptions = { content, embeds, components };

        if (this.raw.replied || this.raw.deferred) {
            return await this.raw.editReply(editOptions);
        }

        return await this.reply(options);
    }

    private safeDelete(message: any, delay: number): void {
        setTimeout(() => {
            message.delete().catch(() => {});
        }, delay);
    }
}
