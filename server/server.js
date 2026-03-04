import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import axios from 'axios';
import NodeCache from 'node-cache';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const cache = new NodeCache({ stdTTL: 3600 }); // Cache for 1 hour

app.use(cors());
app.use(express.json());

// Spotify Token Management
let spotifyToken = null;
let tokenExpiry = null;

async function getSpotifyToken() {
  if (spotifyToken && tokenExpiry && Date.now() < tokenExpiry) {
    return spotifyToken;
  }

  const cached = cache.get('spotify_token');
  if (cached) {
    spotifyToken = cached;
    return cached;
  }

  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(
            `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString('base64')}`,
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiry = Date.now() + response.data.expires_in * 1000;
    cache.set('spotify_token', spotifyToken, response.data.expires_in);
    
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error.message);
    throw new Error('Failed to authenticate with Spotify');
  }
}

// Search endpoint
app.get('/api/search', async (req, res) => {
  try {
    const { q, type = 'track,album,artist' } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    const token = await getSpotifyToken();
    const response = await axios.get('https://api.spotify.com/v1/search', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        q,
        type,
        limit: 20,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Search error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get track details
app.get('/api/track/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getSpotifyToken();
    
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Track fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch track' });
  }
});

// Get album details
app.get('/api/album/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getSpotifyToken();
    
    const response = await axios.get(`https://api.spotify.com/v1/albums/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Album fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch album' });
  }
});

// Get artist details
app.get('/api/artist/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const token = await getSpotifyToken();
    
    const [artistRes, topTracksRes] = await Promise.all([
      axios.get(`https://api.spotify.com/v1/artists/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=US`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    res.json({
      ...artistRes.data,
      topTracks: topTracksRes.data.tracks,
    });
  } catch (error) {
    console.error('Artist fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch artist' });
  }
});

// Get recommendations
app.get('/api/recommendations', async (req, res) => {
  try {
    const { seed_tracks, seed_artists, seed_genres } = req.query;
    const token = await getSpotifyToken();
    
    const response = await axios.get('https://api.spotify.com/v1/recommendations', {
      headers: { Authorization: `Bearer ${token}` },
      params: {
        seed_tracks,
        seed_artists,
        seed_genres,
        limit: 20,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Recommendations error:', error.message);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

// Get featured playlists
app.get('/api/featured-playlists', async (req, res) => {
  try {
    const token = await getSpotifyToken();
    
    const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists', {
      headers: { Authorization: `Bearer ${token}` },
      params: { limit: 20 },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Featured playlists error:', error.message);
    res.status(500).json({ error: 'Failed to fetch playlists' });
  }
});

// Search YouTube for streaming
app.get('/api/youtube/search', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }

    // Return search query for client-side YouTube iframe API
    // This avoids needing YouTube API key and quotas
    res.json({ query: q });
  } catch (error) {
    console.error('YouTube search error:', error.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get lyrics (using a free lyrics API)
app.get('/api/lyrics', async (req, res) => {
  try {
    const { artist, title } = req.query;
    
    if (!artist || !title) {
      return res.status(400).json({ error: 'Artist and title are required' });
    }

    // Using lyrics.ovh API (free, no auth required)
    const response = await axios.get(
      `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(title)}`
    );

    res.json(response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      return res.status(404).json({ error: 'Lyrics not found' });
    }
    console.error('Lyrics fetch error:', error.message);
    res.status(500).json({ error: 'Failed to fetch lyrics' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🎵 IAMMUSIC Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
