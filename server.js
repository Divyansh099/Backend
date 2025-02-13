const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const corsAnywhere = require('cors-anywhere');

const app = express();

app.use(cors({ origin: '*' })); // Allows frontend to make requests from any origin

app.use('/api', createProxyMiddleware({
    target: 'https://developers.google.com',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '', // remove /api prefix when forwarding to target
    },
    onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', `Bearer ${process.env.API_KEY}`);
    },
    onProxyRes: (proxyRes, req, res) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    },
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`CORS Proxy Server running on port ${PORT}`);
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