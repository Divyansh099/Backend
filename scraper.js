const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

const scrapeData = async (url) => {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
      },
    });
    const $ = cheerio.load(html);
    const baseUrl = new URL(url);
    const results = {
      pageTitle: $("title").text().trim(),
      metaDescription: $('meta[name="description"]').attr("content") || "",
      links: [],
      images: [],
      headings: [],
    };

    $("a").each((_, el) => {
      const href = $(el).attr("href");
      if (href) {
        try {
          const absoluteHref = new URL(href, baseUrl).href;
          if (absoluteHref !== "#") {
            results.links.push({
              text: $(el).text().trim() || "No text",
              href: absoluteHref,
            });
          }
        } catch (err) {
          // Skip invalid URLs
        }
      }
    });

    $("img").each((_, el) => {
      const src = $(el).attr("src");
      if (src) {
        try {
          results.images.push({
            alt: $(el).attr("alt") || "No alt text",
            src: new URL(src, baseUrl).href,
          });
        } catch (err) {
          // Skip invalid image URLs
        }
      }
    });

    ["h1", "h2", "h3", "h4", "h5", "h6"].forEach((tag) => {
      $(tag).each((_, el) => {
        const text = $(el).text().trim();
        if (text) results.headings.push({ tag, text });
      });
    });

    return results;
  } catch (error) {
    console.error("Error scraping data:", error.message);
    return null;
  }
};

module.exports = scrapeData;
