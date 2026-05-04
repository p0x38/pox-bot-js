import { ColorResolvable, EmbedBuilder } from 'discord.js';

export abstract class PaginationView<T> {
    protected items: T[];
    protected itemsPerPage: number;
    protected title: string;
    protected color: ColorResolvable;

    constructor(items: T[], title: string, itemsPerPage: number = 10) {
        this.items = items;
        this.title = title;
        this.itemsPerPage = itemsPerPage;
        this.color = 0x00ae86;
    }

    abstract renderItem(item: T, index: number): string;

    public getPageCount(): number {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }

    public getPage(pageNumber: number): EmbedBuilder {
        const totalPages = this.getPageCount();
        const page = Math.max(1, Math.min(pageNumber, totalPages));

        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.items.slice(start, end);

        const description = pageItems
            .map((item, i) => this.renderItem(item, start + i))
            .join('\n');

        return new EmbedBuilder()
            .setTitle(this.title)
            .setDescription(description || 'No items to display.')
            .setColor(this.color)
            .setFooter({
                text: `Page ${page} / ${totalPages} (Toal: ${this.items.length})`,
            })
            .setTimestamp();
    }
}
