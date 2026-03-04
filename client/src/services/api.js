import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const searchTracks = async (query, type = 'track,album,artist') => {
  const response = await api.get('/search', {
    params: { q: query, type },
  });
  return response.data;
};

export const getTrack = async (id) => {
  const response = await api.get(`/track/${id}`);
  return response.data;
};

export const getAlbum = async (id) => {
  const response = await api.get(`/album/${id}`);
  return response.data;
};

export const getArtist = async (id) => {
  const response = await api.get(`/artist/${id}`);
  return response.data;
};

export const getRecommendations = async (params) => {
  const response = await api.get('/recommendations', { params });
  return response.data;
};

export const getFeaturedPlaylists = async () => {
  const response = await api.get('/featured-playlists');
  return response.data;
};

export const getLyrics = async (artist, title) => {
  try {
    const response = await api.get('/lyrics', {
      params: { artist, title },
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return { lyrics: 'Lyrics not available for this track.' };
    }
    throw error;
  }
};

export const searchYouTube = async (query) => {
  const response = await api.get('/youtube/search', {
    params: { q: query },
  });
  return response.data;
};

export default api;
