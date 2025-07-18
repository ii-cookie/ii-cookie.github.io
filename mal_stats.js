import express from 'express';
import cors from 'cors';
import axios from 'axios';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuration
const CLIENT_ID = process.env.MAL_CLIENT_ID;
const CLIENT_SECRET = process.env.MAL_CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/callback'; // Update to your redirect URI
const PORT = 3000;

// Store code verifier globally (in production, use a session or database)
let codeVerifier;

// Generate PKCE code verifier and challenge
function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCodeChallenge(verifier) {
  return crypto
    .createHash('sha256')
    .update(verifier)
    .digest('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

// Step 1: Redirect user to MAL authorization page
app.get('/auth', (req, res) => {
  codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const authUrl = `https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&code_challenge=${codeChallenge}&redirect_uri=${REDIRECT_URI}`;
  res.redirect(authUrl);
});

// Step 2: Handle OAuth2 callback and exchange code for token
app.get('/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) {
    return res.status(400).send('Authorization code not provided');
  }

  try {
    const tokenResponse = await axios.post('https://myanimelist.net/v1/oauth2/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    });

    const { access_token, refresh_token, expires_in } = tokenResponse.data;

    // Store tokens securely (e.g., in a database or session)
    // For this example, we'll pass the access token to the next step
    res.redirect(`/anime-list?access_token=${access_token}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error.response?.data || error.message);
    res.status(500).send('Authentication failed');
  }
});

// Step 3: Fetch user's anime list
app.get('/anime-list', async (req, res) => {
  const { access_token } = req.query;
  const username = 'c00ki3c00kiy'; // Replace with dynamic username if needed

  try {
    const response = await axios.get(`https://api.myanimelist.net/v2/users/${username}/animelist`, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
      params: {
        status: 'completed', // Options: watching, completed, on_hold, dropped, plan_to_watch, all
        limit: 100, // Max 1000
        sort: 'list_updated_at', // Sort by last updated
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching anime list:', error.response?.data || error.message);
    res.status(500).send('Failed to fetch anime list');
  }
});

// Optional: Refresh token endpoint
app.post('/refresh-token', async (req, res) => {
  const { refresh_token } = req.body;

  try {
    const response = await axios.post('https://myanimelist.net/v1/oauth2/token', {
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refresh_token,
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error refreshing token:', error.response?.data || error.message);
    res.status(500).send('Failed to refresh token');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});