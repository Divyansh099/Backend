const axios = require("axios");
const cheerio = require("cheerio");

const scrapeData = async (url) => {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        
        let results = [];

        $("a").each((index, element) => {
            results.push({
                title: $(element).text().trim() || "No title",
                link: $(element).attr("href") || "#",
            });
        });

        return results;
    } catch (error) {
        console.error("Error scraping data:", error);
        return [];
    }
};

module.exports = scrapeData;
