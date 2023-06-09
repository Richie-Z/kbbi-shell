import { Command } from "commander";
import { scrapeData, format } from "./kbbi.mjs";

const program = new Command();
program
  .version("1.0.0")
  .arguments("<query>")
  .description("KBBI on your shell!")
  .action(async (query) => {
    format(query, await scrapeData(query));
  });

program.parse(process.argv);
