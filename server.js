const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const corsAnywhere = require('cors-anywhere');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors()); // Allows frontend to make requests
app.use(express.json()); // Enables JSON request body parsing

// API Root Route
app.get("/", (req, res) => {
    res.send("Backend is running on Render!");
});

// Web Scraper API Route
app.post("/scrape", async (req, res) => {
    const { url } = req.body; // Get the URL from the request

    if (!url) {
        return res.status(400).json({ error: "Please provide a URL to scrape." });
    }

    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        let results = [];

        // Extract links and titles
        $("a").each((index, element) => {
            const title = $(element).text().trim();
            const link = $(element).attr("href");

            if (link) {
                results.push({ title, link });
            }
        });

        res.json({ success: true, data: results });
    } catch (error) {
        console.error("Scraping error:", error.message);
        res.status(500).json({ error: "Failed to scrape the website." });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// CORS Anywhere Proxy Server
const corsHost = '0.0.0.0';
const corsPort = 8080;

corsAnywhere.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(corsPort, corsHost, () => {
    console.log(`CORS Anywhere server running on ${corsHost}:${corsPort}`);
});