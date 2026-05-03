"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HelpPagination = void 0;
const PaginationView_1 = require("./PaginationView");
class HelpPagination extends PaginationView_1.PaginationView {
    renderItem(item, index) {
        let generatedUsage = '';
        if (item.args && item.args.length > 0) {
            generatedUsage = ' ' + item.args.map(arg => {
                const wrap = arg.required ? ['<', '>'] : ['[', ']'];
                return `${wrap}${arg.name}${wrap}`;
            }).join(' ');
        }
        else if (item.usage) {
            generatedUsage = ` ${item.usage}`;
        }
        return `\`${index + 1}.\` **${item.name}**\`${generatedUsage}\`\n└ ${item.description}`;
    }
}
exports.HelpPagination = HelpPagination;
