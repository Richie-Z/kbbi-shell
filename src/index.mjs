import { Command } from "commander";
import { scrapeData } from "./kbbi.mjs";
import util from "util";

const program = new Command();
program
  .version("1.0.0")
  .command("kbbi <query>")
  .description("Greet a person")
  .option("-t, --title <title>", "Specify the person's title")
  .action(async (query, options) => {
    console.log(util.inspect(await scrapeData(query), { depth: null }));
  });

program.parse(process.argv);
