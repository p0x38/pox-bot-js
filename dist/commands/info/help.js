// src/commands/info/help.ts
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  SlashCommandBuilder
} from "discord.js";

// src/views/PaginationView.ts
import { EmbedBuilder } from "discord.js";
var PaginationView = class {
  items;
  itemsPerPage;
  title;
  color;
  constructor(items, title, itemsPerPage = 10) {
    this.items = items;
    this.title = title;
    this.itemsPerPage = itemsPerPage;
    this.color = 44678;
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
    const description = pageItems.map((item, i) => this.renderItem(item, start + i)).join("\n");
    return new EmbedBuilder().setTitle(this.title).setDescription(description || "No items to display.").setColor(this.color).setFooter({ text: `Page ${page} / ${totalPages} (Toal: ${this.items.length})` }).setTimestamp();
  }
};

// src/views/HelpView.ts
var HelpPagination = class extends PaginationView {
  renderItem(item, index) {
    let generatedUsage = "";
    if (item.args && item.args.length > 0) {
      generatedUsage = " " + item.args.map((arg) => {
        const wrap = arg.required ? ["<", ">"] : ["[", "]"];
        return `${wrap}${arg.name}${wrap}`;
      }).join(" ");
    } else if (item.usage) {
      generatedUsage = ` ${item.usage}`;
    }
    return `\`${index + 1}.\` **${item.name}**\`${generatedUsage}\`
\u2514 ${item.description}`;
  }
};

// src/commands/info/help.ts
var help = {
  name: "help",
  description: "Shows a list of all available commands.",
  data: new SlashCommandBuilder().setName("help").setDescription("Shows a list of all available commands.").addIntegerOption((opt) => opt.setName("page").setDescription("Page number")),
  execute: async (message) => {
    const commandsArray = Array.from(
      message.client.commands.values()
    );
    const helpView = new HelpPagination(commandsArray, "PoxBot Help");
    let currentPage = 1;
    const maxPages = helpView.getPageCount();
    const getButtons = (page) => {
      return new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("prev").setLabel("\u25C0\uFE0F").setStyle(ButtonStyle.Secondary).setDisabled(page === 1),
        new ButtonBuilder().setCustomId("next").setLabel("\u25B6\uFE0F").setStyle(ButtonStyle.Secondary).setDisabled(page === maxPages)
      );
    };
    const response = await message.reply({
      embeds: [helpView.getPage(currentPage)],
      components: maxPages > 1 ? [getButtons(currentPage)] : []
    });
    if (maxPages <= 1 || !response) return;
    const collector = response.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 6e4
    });
    collector.on("collect", async (i) => {
      const userId = "author" in message ? message.user.id : message.user.id;
      if (i.user.id !== userId) {
        await i.reply({
          content: "Only the command user can flip pages.",
          ephemeral: true
        });
        return;
      }
      if (i.customId === "prev") currentPage--;
      else if (i.customId === "next") currentPage++;
      await i.update({
        embeds: [helpView.getPage(currentPage)],
        components: [getButtons(currentPage)]
      });
    });
    collector.on("end", () => {
      response.edit({ components: [] }).catch(() => {
      });
    });
  }
};
var help_default = help;
export {
  help_default as default,
  help
};
