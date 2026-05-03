import { Message } from "discord.js";

export interface IConverter {
    convert(message: Message, value: string): Promise<any>;
}

export type ConverterClass = {
    convert: (message: Message, value: string) => Promise<any>;
};