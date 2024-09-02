const express = require('express');
const querystring = require('querystring');
const axios = require('axios');
const cookieParser = require('cookie-parser');
const app = express();
require('dotenv').config({ path: '../.env' });

app.use(cookieParser());

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.SPOTIFY_REDIRECT_URI;

function generateRandomString(length) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

app.get('/login', (req, res) => {
  const state = generateRandomString(16);
  const scope = 'playlist-modify-private playlist-read-private';

  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
});

app.get('/callback', async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post('https://accounts.spotify.com/api/token', querystring.stringify({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirect_uri
    }), {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${client_id}:${client_secret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const accessToken = response.data.access_token;

    res.cookie('spotify_access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
      path: '/',
      domain: 'localhost'
    });

    res.redirect('http://localhost:3000/Home');
  } catch (error) {
    console.error('Error during Spotify callback:', error);
    res.status(500).send('An error occurred during authentication.');
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
