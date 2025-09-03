// Import required modules
const express = require('express');
const fs = require('fs');
const https = require('https');
const dashboard = express();

// Import configuration and utilities
const client = require('../backend/bot/bot.js');
const { PORT } = require('../config/config.json');

// Set EJS as the view engine and configure static files
dashboard.set('view engine', 'ejs');
dashboard.set('views', 'frontend/templates');
dashboard.use("/public", express.static('frontend/public'));

// Enable trust proxy for Cloudflare
dashboard.enable('trust proxy');

// SSL configuration with Cloudflare Origin Certificate
const options = {
    key: fs.readFileSync('/etc/ssl/origin-key.pem'),
    cert: fs.readFileSync('/etc/ssl/origin-cert.pem')
};

// Start the Express server
https.createServer(options, dashboard).listen(PORT || 443, () => {
    console.log(`LGDH listening on port ${PORT || 443}`);
});

// Start the bot
client;

// Home route: redirect authenticated users, render homepage for others
dashboard.get('/', async (req, res) => {
    const page = req.query.page;
    res.render('dashboard', { currentPage: page });
});