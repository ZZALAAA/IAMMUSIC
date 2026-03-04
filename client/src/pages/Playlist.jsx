import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, MoreVertical, Trash2, Edit2, Heart } from 'lucide-react';
import usePlaylistStore from '../store/playlistStore';
import usePlayerStore from '../store/playerStore';
import './Playlist.css';

const Playlist = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { playlists, deletePlaylist, renamePlaylist, removeTrackFromPlaylist } = usePlaylistStore();
  const { setCurrentTrack, setQueue, setIsPlaying } = usePlayerStore();
  const { isFavorite, toggleFavorite } = usePlaylistStore();

  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');

  const playlist = playlists.find((p) => p.id === id);

  if (!playlist) {
    return (
      <div className="playlist-page">
        <div className="empty-state">
          <h2>Playlist non trovata</h2>
          <button onClick={() => navigate('/library')} className="btn-primary">
            Torna alla libreria
          </button>
        </div>
      </div>
    );
  }

  const handlePlayPlaylist = () => {
    if (playlist.tracks.length === 0) return;
    setQueue(playlist.tracks);
    setCurrentTrack(playlist.tracks[0]);
    setIsPlaying(true);
  };

  const handlePlayTrack = (track) => {
    setCurrentTrack(track);
    setQueue(playlist.tracks);
    setIsPlaying(true);
  };

  const handleDelete = () => {
    if (confirm(`Vuoi eliminare "${playlist.name}"?`)) {
      deletePlaylist(id);
      navigate('/library');
    }
  };

  const handleRename = () => {
    if (newName.trim()) {
      renamePlaylist(id, newName.trim());
      setIsEditing(false);
      setNewName('');
    }
  };

  return (
    <div className="playlist-page">
      <div className="playlist-header">
        <div className="playlist-cover">
          <Heart size={64} />
        </div>
        <div className="playlist-header-info">
          <span className="playlist-type">PLAYLIST</span>
          {isEditing ? (
            <div className="playlist-edit">
              <input
                type="text"
                defaultValue={playlist.name}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleRename();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                autoFocus
                className="playlist-name-input"
              />
            </div>
          ) : (
            <h1 className="playlist-name">{playlist.name}</h1>
          )}
          <p className="playlist-meta">
            {playlist.tracks.length} brani
            {playlist.tracks.length > 0 && (
              <>
                {' • '}
                {Math.floor(
                  playlist.tracks.reduce((acc, t) => acc + t.duration_ms, 0) / 60000
                )} min
              </>
            )}
          </p>
        </div>

        <div className="playlist-actions-menu">
          <button className="icon-btn" onClick={() => setShowMenu(!showMenu)}>
            <MoreVertical size={24} />
          </button>
          {showMenu && (
            <div className="playlist-menu">
              <button
                className="playlist-menu-item"
                onClick={() => {
                  setIsEditing(true);
                  setShowMenu(false);
                }}
              >
                <Edit2 size={18} />
                <span>Rinomina</span>
              </button>
              <button className="playlist-menu-item delete" onClick={handleDelete}>
                <Trash2 size={18} />
                <span>Elimina</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="playlist-controls">
        <button
          className="play-btn-large"
          onClick={handlePlayPlaylist}
          disabled={playlist.tracks.length === 0}
        >
          <Play size={28} fill="currentColor" />
        </button>
      </div>

      <div className="playlist-tracks">
        {playlist.tracks.length > 0 ? (
          <div className="tracks-list">
            {playlist.tracks.map((track, index) => (
              <div key={`${track.id}-${index}`} className="track-item fade-in">
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
                  <button className="play-btn-small" onClick={() => handlePlayTrack(track)}>
                    <Play size={16} fill="currentColor" />
                  </button>
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

                <div className="track-actions">
                  <button
                    className={`icon-btn ${isFavorite(track.id) ? 'active' : ''}`}
                    onClick={() => toggleFavorite(track)}
                  >
                    <Heart size={18} fill={isFavorite(track.id) ? 'currentColor' : 'none'} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => removeTrackFromPlaylist(id, track.id)}
                    title="Rimuovi dalla playlist"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Playlist vuota</h2>
            <p>Cerca brani e aggiungili a questa playlist</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;
