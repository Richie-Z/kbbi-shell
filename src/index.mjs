import { Command } from "commander";
import { scrapeData, format } from "./kbbi.mjs";

const program = new Command();
program
  .version("1.0.3")
  .arguments("<query>", "Text to search")
  .description("KBBI on your shell!")
  .option('-j, --json', "Output as JSON")
  .action(async (query, options) => {
    if (options.json)
      return console.log(await scrapeData(query))
    return format(query, await scrapeData(query))
  });

export default program.parse(process.argv);
