import { create } from 'zustand';

// Load from localStorage
const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem('iammusic-playlists');
    return stored ? JSON.parse(stored) : { playlists: [], favorites: [] };
  } catch {
    return { playlists: [], favorites: [] };
  }
};

// Save to localStorage
const saveToStorage = (playlists, favorites) => {
  try {
    localStorage.setItem('iammusic-playlists', JSON.stringify({ playlists, favorites }));
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
};

const initialState = loadFromStorage();

const usePlaylistStore = create((set, get) => ({
  playlists: initialState.playlists,
  currentPlaylist: null,
  favorites: initialState.favorites,
  
  createPlaylist: (name) => {
    const newPlaylist = {
      id: Date.now().toString(),
      name,
      tracks: [],
      createdAt: new Date().toISOString(),
    };
    
    set((state) => {
      const newPlaylists = [...state.playlists, newPlaylist];
      saveToStorage(newPlaylists, state.favorites);
      return { playlists: newPlaylists };
    });
    
    return newPlaylist;
  },
  
  deletePlaylist: (id) => set((state) => {
    const newPlaylists = state.playlists.filter((p) => p.id !== id);
    saveToStorage(newPlaylists, state.favorites);
    return {
      playlists: newPlaylists,
      currentPlaylist: state.currentPlaylist?.id === id ? null : state.currentPlaylist,
    };
  }),
  
  renamePlaylist: (id, newName) => set((state) => {
    const newPlaylists = state.playlists.map((p) =>
      p.id === id ? { ...p, name: newName } : p
    );
    saveToStorage(newPlaylists, state.favorites);
    return { playlists: newPlaylists };
  }),
  
  addTrackToPlaylist: (playlistId, track) => set((state) => {
    const newPlaylists = state.playlists.map((p) =>
      p.id === playlistId
        ? {
            ...p,
            tracks: p.tracks.some((t) => t.id === track.id)
              ? p.tracks
              : [...p.tracks, track],
          }
        : p
    );
    saveToStorage(newPlaylists, state.favorites);
    return { playlists: newPlaylists };
  }),
  
  removeTrackFromPlaylist: (playlistId, trackId) => set((state) => {
    const newPlaylists = state.playlists.map((p) =>
      p.id === playlistId
        ? { ...p, tracks: p.tracks.filter((t) => t.id !== trackId) }
        : p
    );
    saveToStorage(newPlaylists, state.favorites);
    return { playlists: newPlaylists };
  }),
  
  setCurrentPlaylist: (playlist) => set({ currentPlaylist: playlist }),
  
  toggleFavorite: (track) => set((state) => {
    const isFavorite = state.favorites.some((t) => t.id === track.id);
    const newFavorites = isFavorite
      ? state.favorites.filter((t) => t.id !== track.id)
      : [...state.favorites, track];
    saveToStorage(state.playlists, newFavorites);
    return { favorites: newFavorites };
  }),
  
  isFavorite: (trackId) => {
    const state = get();
    return state.favorites.some((t) => t.id === trackId);
  },
}));

export default usePlaylistStore;
