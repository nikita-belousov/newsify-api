const puppeteer = require("puppeteer");
const { parse } = require("node-html-parser");
const resources = require("./resources");

const results = [];
let browser;

(async () => {
  browser = await puppeteer.launch();
  await parseResources(resources);
})();

async function parseResources(resources) {
  await Promise.all(Object.values(resources).map(parseResource));
}

async function parseResource(resource) {
  const url = resource.getNewsPageUrl();
  const data = await getResource(url);
  const root = parse(data);
  const urls = resource.getArticlesUrls(root);

  return await Promise.all([...urls].map((url) => parseArticle(resource, url)));
}

async function parseArticle(resource, url) {
  const data = await getResource(url);
  const article = parse(data);
  const heading = resource.getArticleHeading(article);
  const text = resource.getArticleText(article);
  const image = resource.getArticleImage(article);

  if (!heading || !text) {
    return;
  }

  results.push({
    source: resource.title,
    url,
    heading,
    text: text.substring(0, 200) + "...",
    image
  });
}

async function getResource(url) {
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForTimeout(2000);
  return page.content();
}
