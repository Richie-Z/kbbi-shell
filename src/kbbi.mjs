import * as cheerio from "cheerio";
import axios from "axios";

async function fetchData(url) {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (error) {
    console.error(error);
  }
}

function getOLKategoriPenjelasan($, element) {
  let penjelasan = $(element)
    .contents()
    .map(function () {
      return getULKategoriPenjelasan($, this);
    })
    .get();
  return { penjelasan };
}

function getULKategoriPenjelasan($, element) {
  let kategoriEl = $(element).find("span[title]");
  let kategori = kategoriEl.attr("title");
  let subKategori = "";
  if (kategoriEl.length > 1)
    subKategori = kategoriEl
      .slice(1)
      .map(function () {
        return $(this).attr("title");
      })
      .get()
      .join(", ");

  kategoriEl.each(function () {
    $(this).remove();
  });

  let penjelasan = $(element)
    .contents()
    .map(function () {
      return $(this).text().trim();
    })
    .get()
    .join("");
  return { kategori, subKategori, penjelasan };
}

function getKategoriPenjelasan($, element) {
  let next = $(element);
  let loop = 0;
  let kategori = "";
  let penjelasan = "";
  if (next.is("[style]")) {
    while (next.prop("tagName") !== "OL") {
      next = next.next();
    }
    return getOLKategoriPenjelasan($, next);
  } else {
    while (next.prop("tagName") !== "HR") {
      if (loop === 0) {
        kategori = next.attr("title");
      } else {
        penjelasan += next.text().trim();
      }
      loop++;
      next = next.next();
    }
  }
  return { kategori, penjelasan };
}

export async function scrapeData(param) {
  const data = await fetchData(`https://kbbi.kemdikbud.go.id/entri/${param}`);

  const $ = cheerio.load(data);

  let resultList = [];

  for (let index = 0; index < $("h2").length; index++) {
    const judul = $("h2").eq(index).text();
    $("h2")
      .eq(index)
      .next()
      .next()
      .each((key, element) => {
        switch ($(element).prop("tagName")) {
          case "OL":
            resultList[judul] = getOLKategoriPenjelasan($, element);
            break;
          case "UL":
            resultList[judul] = getULKategoriPenjelasan($, element);
            break;
          default:
            resultList[judul] = getKategoriPenjelasan($, element);
            break;
        }
      });
  }
  return resultList;
}
