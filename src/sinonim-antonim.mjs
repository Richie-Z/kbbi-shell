import axios from "axios"
import * as cheerio from "cheerio"
import color from "colors-cli/safe";

async function fetchData(query) {
  try {
    const searchQuery = await axios.get(`https://www.sinonimkata.com/search.php?q=${query}`)
    const { data } = await axios.get(searchQuery.request?.res.responseUrl)
    return data
  } catch (error) {
    console.error(error)
  }
}

function scrapeData(mode, $) {
  let selectedMode = mode === "sinonim" ? 0 : 1
  const datas = $.eq(selectedMode).find("td[width=90%]").children().map(function() {
    return cheerio.load(this).text().trim()
  }).get()

  return { mode: mode, datas }
}

export async function getData(mode, query) {
  const $ = cheerio.load(await fetchData(query))
  if ($("h2").eq(0).text() !== "Tesaurus Bahasa Indonesia") {
    return undefined
  }
  return scrapeData(mode, $(".lemmas"))
}

export function format(param, data) {
  console.log(color.x45.bold.underline(param));
  if (typeof data === "undefined") {
    return console.log(color.x160.bold("Word not found!"))
  }
  console.log(color.yellow.bold(data.mode))
  for (let index = 0; index < data.datas.length; index++) {
    const element = data.datas[index];
    console.log(" ".repeat(4) + `${index + 1}. ${color.bold(element)}`);
  }
}
