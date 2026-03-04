import React, { useEffect, useState } from 'react';
import { Play, Heart } from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import usePlaylistStore from '../store/playlistStore';
import { getFeaturedPlaylists } from '../services/api';
import './Home.css';

const Home = () => {
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const { setCurrentTrack, setQueue, setIsPlaying } = usePlayerStore();
  const { favorites } = usePlaylistStore();

  useEffect(() => {
    loadFeaturedPlaylists();
  }, []);

  const loadFeaturedPlaylists = async () => {
    try {
      const data = await getFeaturedPlaylists();
      setFeaturedPlaylists(data.playlists?.items || []);
    } catch (error) {
      console.error('Error loading featured playlists:', error);
    } finally {
      setLoading(false);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buongiorno';
    if (hour < 18) return 'Buon pomeriggio';
    return 'Buonasera';
  };

  return (
    <div className="home-page">
      <h1 className="page-title">{getGreeting()}</h1>

      {favorites.length > 0 && (
        <section className="quick-picks">
          <div className="quick-pick-item favorites-quick">
            <Heart className="quick-pick-icon" fill="currentColor" />
            <div className="quick-pick-info">
              <h3>Brani che ti piacciono</h3>
              <p>{favorites.length} brani</p>
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <h2 className="section-title">Playlist in evidenza</h2>
        
        {loading ? (
          <div className="loading-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="playlist-card-skeleton pulse"></div>
            ))}
          </div>
        ) : (
          <div className="playlists-grid">
            {featuredPlaylists.slice(0, 6).map((playlist) => (
              <div key={playlist.id} className="playlist-card fade-in">
                <div className="playlist-image">
                  {playlist.images?.[0]?.url && (
                    <img src={playlist.images[0].url} alt={playlist.name} />
                  )}
                  <button className="play-overlay">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
                <div className="playlist-info">
                  <h3>{playlist.name}</h3>
                  <p>{playlist.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <h2 className="section-title">Inizia da qui</h2>
        <p className="section-description">
          Cerca la tua musica preferita o esplora le nostre playlist curate.
          Tutto completamente gratis, senza pubblicità!
        </p>
      </section>
    </div>
  );
};

export default Home;
