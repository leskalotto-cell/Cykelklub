// Simple Node.js Express proxy for Strava API token exchange and data fetch
// 1. Install dependencies: npm install express axios cors dotenv
// 2. Create a .env file with your STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, REDIRECT_URI
// 3. Run: node api/strava-proxy.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3001;

// Exchange code for access token
app.get('/auth', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post('https://www.strava.com/oauth/token', null, {
      params: {
        client_id: process.env.STRAVA_CLIENT_ID,
        client_secret: process.env.STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
      },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

// Proxy to fetch club events (requires access_token)
app.get('/club-events', async (req, res) => {
  const { access_token, club_id } = req.query;
  try {
    const response = await axios.get(`https://www.strava.com/api/v3/clubs/${club_id}/events`, {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.toString() });
  }
});

app.listen(PORT, () => {
  console.log(`Strava proxy server running on port ${PORT}`);
});
