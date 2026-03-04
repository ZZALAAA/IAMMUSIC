import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, Music } from 'lucide-react';
import usePlaylistStore from '../store/playlistStore';
import './Sidebar.css';

const Sidebar = () => {
  const { playlists, favorites, createPlaylist } = usePlaylistStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      createPlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowCreateModal(false);
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Music size={32} className="logo-icon" />
        <h1 className="logo-text">IAMMUSIC</h1>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Home size={24} />
          <span>Home</span>
        </NavLink>
        
        <NavLink to="/search" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Search size={24} />
          <span>Cerca</span>
        </NavLink>
        
        <NavLink to="/library" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Library size={24} />
          <span>La tua libreria</span>
        </NavLink>
      </nav>

      <div className="sidebar-section">
        <button className="create-playlist-btn" onClick={() => setShowCreateModal(true)}>
          <Plus size={20} />
          <span>Crea playlist</span>
        </button>
        
        <NavLink to="/library?tab=favorites" className="nav-item">
          <Heart size={20} />
          <span>Brani che ti piacciono</span>
          {favorites.length > 0 && <span className="count">{favorites.length}</span>}
        </NavLink>
      </div>

      <div className="sidebar-playlists">
        <h3 className="sidebar-playlists-title">Le tue playlist</h3>
        <div className="playlists-list">
          {playlists.map((playlist) => (
            <NavLink
              key={playlist.id}
              to={`/playlist/${playlist.id}`}
              className={({ isActive }) => `playlist-item ${isActive ? 'active' : ''}`}
            >
              <span className="playlist-name">{playlist.name}</span>
              <span className="playlist-count">{playlist.tracks.length} brani</span>
            </NavLink>
          ))}
          
          {playlists.length === 0 && (
            <p className="no-playlists">Nessuna playlist ancora</p>
          )}
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Crea nuova playlist</h2>
            <form onSubmit={handleCreatePlaylist}>
              <input
                type="text"
                placeholder="Nome della playlist"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                autoFocus
                className="modal-input"
              />
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn-secondary"
                >
                  Annulla
                </button>
                <button type="submit" className="btn-primary">
                  Crea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
