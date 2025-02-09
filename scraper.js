const axios = require("axios");
const cheerio = require("cheerio");

const scrapeData = async () => {
  try {
    const response = await axios.get("https://www.thebristolhotel.in/"); // Change to target website
    const $ = cheerio.load(response.data);
    
    let results = [];

    $("h2.title").each((index, element) => {
      results.push({
        title: $(element).text(),
        link: $(element).find("a").attr("href"),
      });
    });

    return results;
  } catch (error) {
    console.error("Error scraping data:", error);
    return [];
  }
};

module.exports = scrapeData;
