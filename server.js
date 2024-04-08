require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const axios = require('axios'); // You'll need to install axios
const reservationRoutes = require('./reservationsRoutes');
const Publisher = require('./publisher');
const { doctorNotification, secretaryNotification, auditLogger } = require('./notifications');

const app = express();
app.use(bodyParser.json());

const db = new sqlite3.Database('./reservations.db', (err) => {
    if (err) {
        console.error('Error opening database', err.message);
    } else {
        console.log('Connected to the database.');
    }
});

// Create a publisher instance for cancellations
const cancellationPublisher = new Publisher();
// Bind the subscriber functions to the publisher
cancellationPublisher.bind(doctorNotification);
cancellationPublisher.bind(secretaryNotification);
cancellationPublisher.bind(auditLogger);

// Use the reservation routes with the db instance
app.use('/api', reservationRoutes(db, cancellationPublisher));

// Redirect to Google's OAuth 2.0 server
app.get('/auth/google', (req, res) => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${encodeURIComponent(process.env.OAUTH_CLIENTID)}&redirect_uri=${encodeURIComponent(process.env.REDIRECT_URI)}&scope=https://mail.google.com/&access_type=offline&prompt=consent`;
  res.redirect(authUrl);
});

// Handle the OAuth 2.0 server response
app.get('/auth/google/callback', async (req, res) => {
  const code = req.query.code;
  if (!code) {
    return res.status(400).send('No code received');
  }

  try {
    const response = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.OAUTH_CLIENTID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      redirect_uri: process.env.REDIRECT_URI,
      grant_type: 'authorization_code',
    });

    // Here you should save the refresh token securely
    // For now, let's just log it
    console.log('Refresh token:', response.data.refresh_token);

    res.send('Authentication successful, check server logs for refresh token');
  } catch (error) {
    console.error('Error during token exchange', error);
    res.status(500).send('Authentication failed');
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
module.exports = app;
