import { readdir, readFile, writeFile } from "node:fs/promises";

const ARTICLES_PATH = "./src/sampleData/articles";
const TOP_WORDS_TO_STORE = 50;

let wordsByFreq;
let neutralWords;
let wordsCount = 0;

(async () => {
  try {
    neutralWords = (
      await readFile("./src/sampleData/neutralWords.txt", {
        encoding: "utf-8"
      })
    ).split(",");

    const categories = await readdir(ARTICLES_PATH);

    for (const category of categories) {
      wordsByFreq = {};
      const files = await readdir(`${ARTICLES_PATH}/${category}`);

      for (const file of files) {
        const content = await readFile(`${ARTICLES_PATH}/${category}/${file}`, {
          encoding: "utf-8"
        });

        getWords(content);
      }

      const topWords = await getTopNWords(TOP_WORDS_TO_STORE, category);
      await writeFile(`${category}.json`, JSON.stringify(topWords, null, 2));
    }
  } catch (err) {
    console.error(err);
  }
})();

function getWords(text) {
  const words = text
    .match(/[a-zA-Z][a-zA-Z\-'’]+[a-zA-Z]/g)
    .map((w) => w.toLowerCase().trim())
    .filter((w) => !neutralWords.includes(w));

  words.forEach((w) => {
    const freq = wordsByFreq[w];
    wordsByFreq[w] = freq ? freq + 1 : 1;
    wordsCount++;
  });
}

async function getTopNWords(n, category) {
  let catalog = await readFile(`${category}.json`, { encoding: "utf-8" });
  try {
    catalog = JSON.parse(catalog);
  } catch (err) {
    catalog = {};
  }

  const words = { ...wordsByFreq };
  const result = {};

  for (let i = 0; i < n; i++) {
    let max = -Infinity;
    let word = null;

    Object.entries(words).forEach(([w, freq]) => {
      if (freq > max) {
        max = freq;
        word = w;
      }
    });

    words[word] = -Infinity;
    result[word] = {
      freq: max / wordsCount,
      relevance: (catalog[word] || {}).relevance || 0.5
    };
  }

  return result;
}
