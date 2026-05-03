"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationView = void 0;
const discord_js_1 = require("discord.js");
class PaginationView {
    items;
    itemsPerPage;
    title;
    color;
    constructor(items, title, itemsPerPage = 10) {
        this.items = items;
        this.title = title;
        this.itemsPerPage = itemsPerPage;
        this.color = 0x00AE86;
    }
    getPageCount() {
        return Math.ceil(this.items.length / this.itemsPerPage);
    }
    getPage(pageNumber) {
        const totalPages = this.getPageCount();
        const page = Math.max(1, Math.min(pageNumber, totalPages));
        const start = (page - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.items.slice(start, end);
        const description = pageItems
            .map((item, i) => this.renderItem(item, start + i))
            .join('\n');
        return new discord_js_1.EmbedBuilder()
            .setTitle(this.title)
            .setDescription(description || 'No items to display.')
            .setColor(this.color)
            .setFooter({ text: `Page ${page} / ${totalPages} (Toal: ${this.items.length})` })
            .setTimestamp();
    }
}
exports.PaginationView = PaginationView;
