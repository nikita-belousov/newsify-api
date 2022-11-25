module.exports = {
  bbc: {
    id: "bbc",
    title: "BBC",
    url: "https://www.bbc.com",
    getNewsPageUrl() {
      return `${this.url}/news`;
    },
    getArticlesUrls(root) {
      const headings = root.querySelectorAll(".gs-c-promo-heading");

      return [...headings].map((element) => {
        const href = element.getAttribute("href");
        if (/^\//.test(href)) {
          return `${this.url}${href}`;
        }
        return href;
      });
    },
    getArticleHeading(element) {
      const heading = element.querySelector("article h1#main-heading");
      return heading ? heading.innerText : null;
    },
    getArticleText(element) {
      const paragraphs = element.querySelectorAll("article p");
      return paragraphs
        ? [...paragraphs].reduce((result, elem) => {
            return (result += elem.innerText);
          }, "")
        : null;
    },
    getArticleImage(element) {
      const image = element.querySelector("img");
      return image ? image.getAttribute("src") : null;
    }
  },
  cnn: {
    id: "cnn",
    title: "CNN",
    url: "https://edition.cnn.com/",
    getNewsPageUrl() {
      return this.url;
    },
    getArticlesUrls(root) {
      const headings = root.querySelectorAll(".cd__headline");
      console.log(headings);
      return [...headings].map((element) => element.getAttribute("href"));
    },
    getArticleHeading(element) {
      const heading = element.querySelector("headline__text");
      return heading ? heading.innerText : null;
    },
    getArticleText(element) {
      const paragraphs = element.querySelectorAll(
        "article__content .paragraph"
      );
      return paragraphs
        ? [...paragraphs].reduce((result, elem) => {
            return (result += elem.innerText);
          }, "")
        : null;
    },
    getArticleImage(element) {
      return null;
    }
  }
};
