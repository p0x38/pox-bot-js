import { Command } from "../types";
import { PaginationView } from "./PaginationView";

export class HelpPagination extends PaginationView<Command> {
    renderItem(item: Command, index: number): string {
        let generatedUsage = '';
        if (item.args && item.args.length > 0) {
            generatedUsage = ' ' + item.args.map(arg => {
                const wrap = arg.required ? ['<', '>'] : ['[', ']'];
                return `${wrap}${arg.name}${wrap}`;
            }).join(' ');
        } else if (item.usage) {
            generatedUsage = ` ${item.usage}`;
        }

        return `\`${index + 1}.\` **${item.name}**\`${generatedUsage}\`\n└ ${item.description}`;
    }
}