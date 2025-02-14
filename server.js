// Load environment variables from .env file if available
require('dotenv').config();

const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const morgan = require('morgan');
const corsAnywhere = require('cors-anywhere');
const scrapeData = require('./scraper'); // Import the scrapeData function

const app = express();

// Use morgan for HTTP request logging
app.use(morgan('combined'));

// Enable CORS for all origins
app.use(cors({ origin: '*' }));

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

// Advanced Proxy Middleware for /api endpoint
// This forwards requests to https://developers.google.com
if (!process.env.API_KEY) {
  console.warn("Warning: API_KEY environment variable is not set. Proxy requests may fail.");
}
app.use('/api', createProxyMiddleware({
  target: 'https://developers.google.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to target
  },
  onProxyReq: (proxyReq, req, res) => {
    // Set the Authorization header if API_KEY is defined
    if (process.env.API_KEY) {
      proxyReq.setHeader('Authorization', `Bearer ${process.env.API_KEY}`);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Ensure CORS headers are present in the proxy response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
  },
  logLevel: 'debug', // Enable debug logging for proxy requests
}));

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
