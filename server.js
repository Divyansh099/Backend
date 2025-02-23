// Load environment variables from .env file if available
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const corsAnywhere = require('cors-anywhere');
const scrapeData = require('./scraper'); // Import the scrapeData function

const app = express();

// Use morgan for HTTP request logging
app.use(morgan('combined'));

// Enable CORS for frontend domain
app.use(cors({
  origin: 'https://fabulous-florentine-a214a3.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

// Handle preflight requests
app.options('*', cors());


// Parse JSON bodies for incoming requests
app.use(express.json());

// Health-check route
app.get('/', (req, res) => {
  res.send("Backend is running on Render!");
});

// Web Scraper API Route
app.post("/scrape", async (req, res) => {
  const { url } = req.body; // Get the URL from the request

  if (!url) {
    return res.status(400).json({ error: "Please provide a URL to scrape." });
  }

  try {
    const data = await scrapeData(url);
    if (!data) {
      return res.status(500).json({ error: "Scraping returned no data." });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({ error: "Failed to scrape the website." });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Express server running on port ${PORT}`);
});

// Advanced CORS Anywhere Proxy Server Configuration
const corsHost = process.env.CORS_HOST || '0.0.0.0';
const corsPort = process.env.CORS_PORT || 8080;

corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2'],
  // Additional advanced settings (like rate limiting) can be added here
}).listen(corsPort, corsHost, () => {
  console.log(`CORS Anywhere server running on ${corsHost}:${corsPort}`);
});
