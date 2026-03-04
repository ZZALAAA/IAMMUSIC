import React, { useState, useEffect } from 'react';
import { Search as SearchIcon, Play, Plus, Heart } from 'lucide-react';
import { searchTracks } from '../services/api';
import usePlayerStore from '../store/playerStore';
import usePlaylistStore from '../store/playlistStore';
import './Search.css';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tracks');

  const { setCurrentTrack, setQueue, setIsPlaying } = usePlayerStore();
  const { isFavorite, toggleFavorite, playlists, addTrackToPlaylist } = usePlaylistStore();

  const [showPlaylistMenu, setShowPlaylistMenu] = useState(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim()) {
        handleSearch();
      } else {
        setResults(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const data = await searchTracks(query);
      setResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Add to queue
    if (results?.tracks?.items) {
      setQueue(results.tracks.items);
    }
  };

  const handleAddToPlaylist = (track, playlistId) => {
    addTrackToPlaylist(playlistId, track);
    setShowPlaylistMenu(null);
  };

  const tracks = results?.tracks?.items || [];
  const albums = results?.albums?.items || [];
  const artists = results?.artists?.items || [];

  return (
    <div className="search-page">
      <div className="search-header">
        <h1 className="page-title">Cerca</h1>
        <div className="search-bar">
          <SearchIcon size={24} className="search-icon" />
          <input
            type="text"
            placeholder="Cosa vuoi ascoltare?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {loading && (
        <div className="search-loading">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {results && !loading && (
        <>
          <div className="search-tabs">
            <button
              className={`tab ${activeTab === 'tracks' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracks')}
            >
              Brani
            </button>
            <button
              className={`tab ${activeTab === 'albums' ? 'active' : ''}`}
              onClick={() => setActiveTab('albums')}
            >
              Album
            </button>
            <button
              className={`tab ${activeTab === 'artists' ? 'active' : ''}`}
              onClick={() => setActiveTab('artists')}
            >
              Artisti
            </button>
          </div>

          <div className="search-results">
            {activeTab === 'tracks' && (
              <div className="tracks-list">
                {tracks.map((track, index) => (
                  <div key={track.id} className="track-item fade-in">
                    <div className="track-number">{index + 1}</div>
                    
                    <div className="track-image-small">
                      {track.album?.images?.[0]?.url ? (
                        <img src={track.album.images[2]?.url || track.album.images[0]?.url} alt={track.name} />
                      ) : (
                        <div className="no-image"></div>
                      )}
                      <button
                        className="play-btn-small"
                        onClick={() => playTrack(track)}
                      >
                        <Play size={16} fill="currentColor" />
                      </button>
                    </div>

                    <div className="track-info-main">
                      <div className="track-name">{track.name}</div>
                      <div className="track-artist">
                        {track.artists?.map((a) => a.name).join(', ')}
                      </div>
                    </div>

                    <div className="track-album">
                      {track.album?.name}
                    </div>

                    <div className="track-duration">
                      {Math.floor(track.duration_ms / 60000)}:
                      {Math.floor((track.duration_ms % 60000) / 1000)
                        .toString()
                        .padStart(2, '0')}
                    </div>

                    <div className="track-actions">
                      <button
                        className={`icon-btn ${isFavorite(track.id) ? 'active' : ''}`}
                        onClick={() => toggleFavorite(track)}
                      >
                        <Heart size={18} fill={isFavorite(track.id) ? 'currentColor' : 'none'} />
                      </button>
                      
                      <div className="playlist-menu-container">
                        <button
                          className="icon-btn"
                          onClick={() => setShowPlaylistMenu(showPlaylistMenu === track.id ? null : track.id)}
                        >
                          <Plus size={18} />
                        </button>
                        
                        {showPlaylistMenu === track.id && (
                          <div className="playlist-menu">
                            {playlists.length > 0 ? (
                              playlists.map((playlist) => (
                                <button
                                  key={playlist.id}
                                  className="playlist-menu-item"
                                  onClick={() => handleAddToPlaylist(track, playlist.id)}
                                >
                                  {playlist.name}
                                </button>
                              ))
                            ) : (
                              <div className="playlist-menu-empty">
                                Nessuna playlist ancora
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'albums' && (
              <div className="albums-grid">
                {albums.map((album) => (
                  <div key={album.id} className="album-card fade-in">
                    <div className="album-image">
                      {album.images?.[0]?.url && (
                        <img src={album.images[0].url} alt={album.name} />
                      )}
                    </div>
                    <div className="album-info">
                      <h3>{album.name}</h3>
                      <p>{album.artists?.map((a) => a.name).join(', ')}</p>
                      <span className="album-year">
                        {new Date(album.release_date).getFullYear()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'artists' && (
              <div className="artists-grid">
                {artists.map((artist) => (
                  <div key={artist.id} className="artist-card fade-in">
                    <div className="artist-image">
                      {artist.images?.[0]?.url && (
                        <img src={artist.images[0].url} alt={artist.name} />
                      )}
                    </div>
                    <div className="artist-info">
                      <h3>{artist.name}</h3>
                      <p>Artista</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {!results && !loading && (
        <div className="search-empty">
          <SearchIcon size={64} />
          <h2>Cerca la tua musica preferita</h2>
          <p>Trova brani, album e artisti</p>
        </div>
      )}
    </div>
  );
};

export default Search;
