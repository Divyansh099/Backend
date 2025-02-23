require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const corsAnywhere = require('cors-anywhere');
const scrapeData = require('./scraper');

const app = express();

// Middleware
app.use(morgan('combined'));
app.use(cors({
  origin: 'https://fabulous-florentine-a214a3.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.options('*', cors());
app.use(express.json());

// Routes
app.get('/', (_, res) => res.send("Backend is running on Render!"));

app.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ success: false, error: "Please provide a URL to scrape." });
  }

  try {
    const data = await scrapeData(url);
    if (!data) {
      return res.status(500).json({ success: false, error: "Scraping returned no data." });
    }
    res.json({ success: true, data });
  } catch (error) {
    console.error("Scraping error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to scrape the website.",
      details: error.message
    });
  }
});

// Start the Express server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express server running on port ${PORT}`));

// CORS Anywhere Proxy Server
const corsHost = process.env.CORS_HOST || '0.0.0.0';
const corsPort = process.env.CORS_PORT || 8080;
corsAnywhere.createServer({
  originWhitelist: [], // Allow all origins
  requireHeader: ['origin', 'x-requested-with'],
  removeHeaders: ['cookie', 'cookie2']
}).listen(corsPort, corsHost, () =>
  console.log(`CORS Anywhere server running on ${corsHost}:${corsPort}`)
);
