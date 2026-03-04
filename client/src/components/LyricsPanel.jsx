import React, { useEffect, useState } from 'react';
import { X, Loader } from 'lucide-react';
import { getLyrics } from '../services/api';
import './LyricsPanel.css';

const LyricsPanel = ({ track, onClose }) => {
  const [lyrics, setLyrics] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLyrics = async () => {
      if (!track) return;

      setLoading(true);
      setError(null);

      try {
        const artist = track.artists?.[0]?.name || '';
        const title = track.name || '';
        
        const data = await getLyrics(artist, title);
        setLyrics(data.lyrics || 'Lyrics not available');
      } catch (err) {
        setError('Failed to load lyrics');
        setLyrics('Lyrics not available for this track.');
      } finally {
        setLoading(false);
      }
    };

    fetchLyrics();
  }, [track]);

  return (
    <div className="lyrics-panel-overlay" onClick={onClose}>
      <div className="lyrics-panel" onClick={(e) => e.stopPropagation()}>
        <div className="lyrics-header">
          <div className="lyrics-track-info">
            <h2>{track.name}</h2>
            <p>{track.artists?.map((a) => a.name).join(', ')}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="lyrics-content">
          {loading ? (
            <div className="lyrics-loading">
              <Loader className="spin" size={32} />
              <p>Loading lyrics...</p>
            </div>
          ) : error ? (
            <div className="lyrics-error">
              <p>{error}</p>
            </div>
          ) : (
            <pre className="lyrics-text">{lyrics}</pre>
          )}
        </div>
      </div>
    </div>
  );
};

export default LyricsPanel;
