const data = {
  "co.ba ": {
    penjelasan: [
      {
        kategori: "Verba: kata kerja",
        penjelasan:
          "silakan; sudilah; tolong (untuk menghaluskan suruhan atau ajakan):-- lihat kalau-kalau ia ada di rumah",
      },
      {
        kategori:
          "Partikel: kelas kata yang meliputi kata depan, kata penghubung, kata seru, kata sandang, ucapan salam",
        penjelasan:
          "kata afektif untuk menyatakan perasaan jengkel dan sebagainya:--, orang apa ini, begitu saja tidak bisa",
      },
      {
        kategori:
          "Partikel: kelas kata yang meliputi kata depan, kata penghubung, kata seru, kata sandang, ucapan salam",
        penjelasan: "seandainya; jika:-- tidak kutolong, celaka engkau",
      },
    ],
  },
};

// Extract the key and penjelasan data
const [key, { penjelasan }] = Object.entries(data)[0];

// Extract the kata dasar from the key
const kataDasar = key.trim();

console.log(kataDasar);
console.log(`/${kataDasar}/\n`);

penjelasan.forEach(({ kategori, penjelasan }) => {
  console.log(kategori);

  const lines = penjelasan.split(":--");

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (index === 0) {
      console.log(`\t<bold>${trimmedLine}</bold>`);
    } else {
      console.log(`\t\t<bold>"${trimmedLine}"</bold>`);
    }
  });

  console.log();
});
