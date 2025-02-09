const express = require("express");
const cors = require("cors");
const scrapeData = require("./scraper");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Allows frontend to access backend
app.use(express.json()); // Parses JSON requests

// Root Route
app.get("/", (req, res) => {
    res.send("Backend is running on Render");
});

// Scraper API Route
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

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});