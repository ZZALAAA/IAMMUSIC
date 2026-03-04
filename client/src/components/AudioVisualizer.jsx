import React, { useEffect, useRef } from 'react';
import './AudioVisualizer.css';

const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width = window.innerWidth;
    const height = canvas.height = 200;

    const bars = 64;
    const barWidth = width / bars;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < bars; i++) {
        // Create animated bars based on time
        const time = Date.now() / 1000;
        const barHeight = Math.abs(Math.sin(time + i * 0.1)) * height * 0.8;
        
        const gradient = ctx.createLinearGradient(0, height - barHeight, 0, height);
        gradient.addColorStop(0, '#1db954');
        gradient.addColorStop(1, '#1ed760');

        ctx.fillStyle = gradient;
        ctx.fillRect(i * barWidth + 2, height - barHeight, barWidth - 4, barHeight);
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      canvas.width = window.innerWidth;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="audio-visualizer">
      <canvas ref={canvasRef}></canvas>
    </div>
  );
};

export default AudioVisualizer;
