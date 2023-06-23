import * as cheerio from "cheerio";
import axios from "axios";
import color from "colors-cli/safe";

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
    .map(function() {
      return getULKategoriPenjelasan($, this);
    })
    .get();
  return { penjelasan };
}

function getULKategoriPenjelasan($, element) {
  let kategoriEl = $(element).find("span[title]");
  let kategori = kategoriEl.attr("title") ?? "";
  let subKategori = "";
  if (kategoriEl.length > 1)
    subKategori = kategoriEl
      .slice(1)
      .map(function() {
        return $(this).attr("title");
      })
      .get()
      .join(", ");

  kategoriEl.each(function() {
    $(this).remove();
  });

  let penjelasan = $(element)
    .contents()
    .map(function() {
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
  let penjelasan = "cari: ";
  if (next.is("[style]")) {
    let hrStyledSkipped = 0;
    while (hrStyledSkipped < 2) {
      if (next.prop("tagName") === "HR" && next.is("[style]"))
        hrStyledSkipped += 1;
      next = next.next();
    }
    if (next.prop("tagName") === "OL") return getOLKategoriPenjelasan($, next);
    else return getULKategoriPenjelasan($, next);
  } else {
    while (next.prop("tagName") !== "HR" && next.prop("tagName") !== "H2") {
      if (loop === 0) {
        kategori = next.attr("title");
      } else {
        penjelasan += next.text().trim();
      }
      loop++;
      next = next.next();
    }
  }
  return { kategori, subKategori: "", penjelasan };
}

export function format(param, data) {
  console.log(color.x45.bold.underline(param));

  const juduls = Object.keys(data);
  for (const judul of juduls) {
    if (typeof data[judul].kategori === "undefined" && data.length === 1) {
      console.log(color.x160.bold("Keyword not found!"))
      break
    }

    console.log(`\\${judul}\\`);

    let isi = data[judul]?.penjelasan;
    if (typeof isi === "string") isi = [data[judul]];
    const penjelasan = isi.reduce(
      (result, { kategori, subKategori, penjelasan }) => {
        if (!result[kategori]) {
          result[kategori] = { penjelasan: [] };
        }
        result[kategori].penjelasan.push(`${result[kategori].penjelasan.length + 1}. ` +
          (typeof subKategori !== "undefined" && subKategori !== ""
            ? `[${color.italic.cyan(subKategori.split(":").join(""))}] `
            : "") + penjelasan
        );
        return result;
      },
      {}
    );

    const kategori = Object.keys(penjelasan);
    for (let i = 0; i < kategori.length; i++) {
      const kat = kategori[i];
      console.log(color.yellow(kat));

      penjelasan[kat].penjelasan.forEach((el) => {
        el.split(":").forEach((line, index) => {
          const trimmedLine = line.trim();
          if (index === 0) console.log(" ".repeat(4) + color.bold(trimmedLine));
          else console.log(" ".repeat(6) + `cth: ${color.italic(trimmedLine)}`);
        });
      });
      console.log();
    }
  }
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
