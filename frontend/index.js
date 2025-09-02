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

const options = {
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
};

// Start the Express server
https.createServer(options, dashboard).listen(PORT, () => {
  console.log(`LGDH listening on port ${PORT}`)
})

// Start the bot
client;

// Home route: redirect authenticated users, render homepage for others
dashboard.get('/', async (req, res) => {
  const page = req.query.page;

  res.render('dashboard', { currentPage: page });
});