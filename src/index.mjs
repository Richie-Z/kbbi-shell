import { Command } from "commander";
import { scrapeData, format } from "./kbbi.mjs";
import * as sinonAnto from "./sinonim-antonim.mjs"

const program = new Command();
program
  .version("1.1.0")
  .arguments("<query>", "Text to search")
  .description("KBBI on your shell!")
  .option('-s, --sinonim', "Search Sinonim")
  .option('-a, --antonim', "Search Antonim")
  .option('-sa, --sinonim_antonim', "Search Sinonim Antonim")
  .option('-j, --json', "Output as JSON")
  .action(async (query, options) => {
    if (options.sinonim_antonim) {
      const dataSinonim = await sinonAnto.getData("sinonim", query)
      const dataAntonim = await sinonAnto.getData("antonim", query)
      if (options.json)
        return console.log(dataSinonim, dataAntonim)

      sinonAnto.format(query, dataSinonim)
      return sinonAnto.format(query, dataAntonim)
    }

    if (options.sinonim || options.antonim) {
      const data = await sinonAnto.getData(options.sinonim ? "sinonim" : "antonim", query)
      if (options.json)
        return console.log(data)
      return sinonAnto.format(query, data)
    }

    if (options.json)
      return console.log(await scrapeData(query))
    return format(query, await scrapeData(query))
  });

export default program.parse(process.argv);
