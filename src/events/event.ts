import { ClientEvents, Collection } from "discord.js";
import { Command } from "../types";

export interface BotEvent<T extends keyof ClientEvents> {
    name: T;
    once?: boolean;
    execute: (...args: [...ClientEvents[T], Collection<string, Command>]) => Promise<void> | void;
}