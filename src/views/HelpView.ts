import { Command } from '@/commands/types';

import { PaginationView } from './PaginationView';

export class HelpPagination extends PaginationView<Command<any>> {
    renderItem(item: Command<any>, index: number): string {
        let generatedUsage = '';
        if (item.args && item.args.length > 0) {
            generatedUsage =
                ' ' +
                item.args
                    .map((arg: any) => {
                        const wrap = arg.required ? ['<', '>'] : ['[', ']'];
                        return `${wrap}${arg.name}${wrap}`;
                    })
                    .join(' ');
        } else if (item.usage) {
            generatedUsage = ` ${item.usage}`;
        }

        return `\`${index + 1}.\` **${item.name}**\`${generatedUsage}\`\n└ ${item.description}`;
    }
}
