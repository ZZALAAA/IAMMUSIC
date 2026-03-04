import React, { useState } from 'react';
import { Heart, Music } from 'lucide-react';
import usePlaylistStore from '../store/playlistStore';
import usePlayerStore from '../store/playerStore';
import './Library.css';

const Library = () => {
  const { playlists, favorites } = usePlaylistStore();
  const [activeTab, setActiveTab] = useState('playlists');

  return (
    <div className="library-page">
      <h1 className="page-title">La tua libreria</h1>

      <div className="library-tabs">
        <button
          className={`tab ${activeTab === 'playlists' ? 'active' : ''}`}
          onClick={() => setActiveTab('playlists')}
        >
          Playlist
        </button>
        <button
          className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
          onClick={() => setActiveTab('favorites')}
        >
          Preferiti
        </button>
      </div>

      <div className="library-content">
        {activeTab === 'playlists' && (
          <div className="playlists-section">
            {playlists.length > 0 ? (
              <div className="library-grid">
                {playlists.map((playlist) => (
                  <a
                    key={playlist.id}
                    href={`/playlist/${playlist.id}`}
                    className="library-card fade-in"
                  >
                    <div className="library-card-image">
                      <Music size={48} />
                    </div>
                    <div className="library-card-info">
                      <h3>{playlist.name}</h3>
                      <p>Playlist • {playlist.tracks.length} brani</p>
                    </div>
                  </a>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Music size={64} />
                <h2>Nessuna playlist ancora</h2>
                <p>Crea la tua prima playlist per iniziare</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favorites-section">
            {favorites.length > 0 ? (
              <div className="tracks-list">
                {favorites.map((track, index) => (
                  <div key={track.id} className="track-item fade-in">
                    <div className="track-number">{index + 1}</div>
                    <div className="track-image-small">
                      {track.album?.images?.[0]?.url ? (
                        <img
                          src={track.album.images[2]?.url || track.album.images[0]?.url}
                          alt={track.name}
                        />
                      ) : (
                        <div className="no-image"></div>
                      )}
                    </div>
                    <div className="track-info-main">
                      <div className="track-name">{track.name}</div>
                      <div className="track-artist">
                        {track.artists?.map((a) => a.name).join(', ')}
                      </div>
                    </div>
                    <div className="track-album">{track.album?.name}</div>
                    <div className="track-duration">
                      {Math.floor(track.duration_ms / 60000)}:
                      {Math.floor((track.duration_ms % 60000) / 1000)
                        .toString()
                        .padStart(2, '0')}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Heart size={64} />
                <h2>Nessun brano preferito</h2>
                <p>I brani che ti piacciono appariranno qui</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
