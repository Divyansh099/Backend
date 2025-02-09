const express = require("express");
const bodyParser = require("body-parser");
const scrapeData = require("./scraper");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Allow frontend access

app.post("/scrape", async (req, res) => {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    try {
        const data = await scrapeData(url);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Error scraping data" });
    }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
