const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const scrapeData = require("./scraper");

dotenv.config();
const app = express();
app.use(cors());

// Endpoint to check if the backend is running
app.get("/", (req, res) => {
  res.send("✅ Backend is running on Render!");
});

// Endpoint to scrape data
app.get("/scrape", async (req, res) => {
  try {
    const data = await scrapeData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Scraping failed" });
  }
});

// Ensure your app binds to a port (default: 5000)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});