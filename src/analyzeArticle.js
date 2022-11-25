import { readFile, readdir } from "node:fs/promises";

let neutralWords;

const catalog = {};

(async () => {
  const categories = await readdir("./src/sampleData/articles");

  neutralWords = (
    await readFile("./src/sampleData/neutralWords.txt", {
      encoding: "utf-8"
    })
  ).split(",");

  for (const category of categories) {
    const data = await readFile(`${category}.json`, { encoding: "utf-8" });
    catalog[category] = JSON.parse(data);
  }

  const text = await readFile("./src/sampleData/test.txt", {
    encoding: "utf-8"
  });

  const words = text
    .match(/[a-zA-Z][a-zA-Z\-'’]+[a-zA-Z]/g)
    .map((w) => w.toLowerCase().trim())
    .filter((w) => !neutralWords.includes(w));

  console.log("\nMatched words:");
  const score = words.reduce((acc, word) => {
    categories.forEach((c) => {
      const w = catalog[c][word];
      if (!w) return;
      const { freq, relevance } = w;
      const weight = freq * relevance;
      if (weight) {
        console.log(word.padEnd(20, " "), c.padEnd(20, " "), weight);
        acc[c] = (acc[c] || 0) + weight;
      }
    });

    return acc;
  }, {});

  console.log("\nOverall score:\n", score);

  const sum = Object.values(score).reduce((acc, val) => acc + val, 0);
  console.log("\nPercentage:");

  categories
    .sort((a, b) => score[b] - score[a])
    .forEach((c) => {
      const sc = score[c];
      const percent = Math.round((sc / sum) * 100);
      console.log(c.padEnd(20, " "), `${percent}%`);
    });
})();
