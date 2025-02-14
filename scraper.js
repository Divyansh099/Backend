const axios = require("axios");
const cheerio = require("cheerio");
const { URL } = require("url");

const scrapeData = async (url, options = {}) => {
    try {
        // Fetch the page with a custom User-Agent header
        const response = await axios.get(url, {
            headers: {
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const baseUrl = new URL(url);

        // Build an object to hold various data extracted from the page
        let results = {
            pageTitle: $("title").text().trim(),
            metaDescription: $('meta[name="description"]').attr("content") || "",
            links: [],
            images: [],
            headings: []
        };

        // Extract anchor elements and convert relative URLs to absolute URLs
        $("a").each((i, elem) => {
            let link = $(elem).attr("href");
            let text = $(elem).text().trim() || "No text";
            if (link) {
                // Convert relative links to absolute URLs
                try {
                    link = new URL(link, baseUrl).href;
                } catch (err) {
                    // Skip invalid URLs
                    return;
                }
                // Filter out placeholder links (like "#")
                if (link !== "#") {
                    results.links.push({
                        text,
                        href: link
                    });
                }
            }
        });

        // Extract image sources and alternative text, ensuring absolute URLs
        $("img").each((i, elem) => {
            let src = $(elem).attr("src");
            if (src) {
                try {
                    src = new URL(src, baseUrl).href;
                } catch (err) {
                    return;
                }
                results.images.push({
                    alt: $(elem).attr("alt") || "No alt text",
                    src
                });
            }
        });

        // Extract headings (h1, h2, h3, etc.)
        ["h1", "h2", "h3", "h4", "h5", "h6"].forEach(tag => {
            $(tag).each((i, elem) => {
                const headingText = $(elem).text().trim();
                if (headingText) {
                    results.headings.push({
                        tag,
                        text: headingText
                    });
                }
            });
        });

        return results;
    } catch (error) {
        console.error("Error scraping data:", error.message);
        return null;
    }
};

module.exports = scrapeData;
