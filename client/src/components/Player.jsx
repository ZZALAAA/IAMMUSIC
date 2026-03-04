import React, { useEffect, useRef, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  ListMusic,
  Music2,
  Maximize2,
} from 'lucide-react';
import usePlayerStore from '../store/playerStore';
import usePlaylistStore from '../store/playlistStore';
import AudioVisualizer from './AudioVisualizer';
import LyricsPanel from './LyricsPanel';
import './Player.css';

const Player = () => {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    repeatMode,
    isShuffled,
    togglePlay,
    setVolume,
    setCurrentTime,
    setDuration,
    playNext,
    playPrevious,
    toggleShuffle,
    cycleRepeat,
    setIsPlaying,
  } = usePlayerStore();

  const { isFavorite, toggleFavorite } = usePlaylistStore();
  
  const [showVolume, setShowVolume] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  
  const playerRef = useRef(null);
  const progressRef = useRef(null);

  // YouTube Player Integration
  useEffect(() => {
    if (!currentTrack) return;

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      const searchQuery = `${currentTrack.artists?.[0]?.name || ''} ${currentTrack.name} audio`;
      
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: '', // Will be set by search
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
        },
        events: {
          onReady: (event) => {
            // Search for video using YouTube iframe API
            event.target.loadVideoByUrl(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`);
            event.target.setVolume(volume * 100);
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              playNext();
            } else if (event.data === window.YT.PlayerState.PLAYING) {
              setIsPlaying(true);
              setDuration(event.target.getDuration());
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              setIsPlaying(false);
            }
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [currentTrack]);

  useEffect(() => {
    if (!playerRef.current) return;

    if (isPlaying) {
      playerRef.current.playVideo();
    } else {
      playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (!playerRef.current) return;
    playerRef.current.setVolume(isMuted ? 0 : volume * 100);
  }, [volume, isMuted]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const time = playerRef.current.getCurrentTime();
        setCurrentTime(time);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current || !playerRef.current) return;
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;
    playerRef.current.seekTo(newTime);
    setCurrentTime(newTime);
  };

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  if (!currentTrack) {
    return (
      <div className="player">
        <div className="player-empty">
          <Music2 size={24} />
          <span>Seleziona un brano per iniziare</span>
        </div>
        <div id="youtube-player"></div>
      </div>
    );
  }

  return (
    <>
      <div className="player">
        <div className="player-track-info">
          <div className="track-image">
            {currentTrack.album?.images?.[0]?.url ? (
              <img src={currentTrack.album.images[0].url} alt={currentTrack.name} />
            ) : (
              <Music2 size={32} />
            )}
          </div>
          <div className="track-details">
            <div className="track-name">{currentTrack.name}</div>
            <div className="track-artist">
              {currentTrack.artists?.map((a) => a.name).join(', ')}
            </div>
          </div>
          <button
            className={`icon-btn ${isFavorite(currentTrack.id) ? 'active' : ''}`}
            onClick={() => toggleFavorite(currentTrack)}
          >
            <Heart size={20} fill={isFavorite(currentTrack.id) ? 'currentColor' : 'none'} />
          </button>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button
              className={`icon-btn ${isShuffled ? 'active' : ''}`}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={20} />
            </button>
            
            <button className="icon-btn" onClick={playPrevious} title="Previous">
              <SkipBack size={24} />
            </button>
            
            <button className="play-btn" onClick={togglePlay}>
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button className="icon-btn" onClick={playNext} title="Next">
              <SkipForward size={24} />
            </button>
            
            <button
              className={`icon-btn ${repeatMode !== 'off' ? 'active' : ''}`}
              onClick={cycleRepeat}
              title={`Repeat: ${repeatMode}`}
            >
              <Repeat size={20} />
              {repeatMode === 'one' && <span className="repeat-indicator">1</span>}
            </button>
          </div>

          <div className="progress-container">
            <span className="time-label">{formatTime(currentTime)}</span>
            <div
              className="progress-bar"
              ref={progressRef}
              onClick={handleProgressClick}
            >
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                <div className="progress-handle"></div>
              </div>
            </div>
            <span className="time-label">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="player-extra-controls">
          <button
            className={`icon-btn ${showLyrics ? 'active' : ''}`}
            onClick={() => setShowLyrics(!showLyrics)}
            title="Lyrics"
          >
            <Music2 size={20} />
          </button>
          
          <button
            className={`icon-btn ${showVisualizer ? 'active' : ''}`}
            onClick={() => setShowVisualizer(!showVisualizer)}
            title="Visualizer"
          >
            <Maximize2 size={20} />
          </button>
          
          <button
            className={`icon-btn ${showQueue ? 'active' : ''}`}
            onClick={() => setShowQueue(!showQueue)}
            title="Queue"
          >
            <ListMusic size={20} />
          </button>

          <div
            className="volume-control"
            onMouseEnter={() => setShowVolume(true)}
            onMouseLeave={() => setShowVolume(false)}
          >
            <button className="icon-btn" onClick={toggleMute}>
              {isMuted || volume === 0 ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {showVolume && (
              <div className="volume-slider">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    setIsMuted(val === 0);
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div id="youtube-player" style={{ display: 'none' }}></div>
      </div>

      {showVisualizer && <AudioVisualizer />}
      {showLyrics && <LyricsPanel track={currentTrack} onClose={() => setShowLyrics(false)} />}
    </>
  );
};

export default Player;
