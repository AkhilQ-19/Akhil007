import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2, ListMusic, Radio, Activity } from 'lucide-react';
import { Track } from '../types';
import SnakeGame from './SnakeGame';

const DUMMY_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Quantum Echoes',
    artist: 'AI COMPOSER // 128 BPM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/synth/400/400'
  },
  {
    id: '2',
    title: 'Silicon Dreams',
    artist: 'NEURAL SYNTH // 140 BPM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://picsum.photos/seed/retro/400/400'
  },
  {
    id: '3',
    title: 'Void Pulse',
    artist: 'DEEP FLOW // 92 BPM',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    coverUrl: 'https://picsum.photos/seed/dream/400/400'
  }
];

interface MusicPlayerProps {
  currentScore: number;
  highScore: number;
  onScoreUpdate: (score: number) => void;
  onHighScoreUpdate: (score: number) => void;
}

export default function MusicPlayer({ currentScore, highScore, onScoreUpdate, onHighScoreUpdate }: MusicPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(err => console.error("Playback error:", err));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleNext = () => {
    setCurrentTrackIndex(prev => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex(prev => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = x / rect.width;
      audioRef.current.currentTime = pct * audioRef.current.duration;
    }
  };

  return (
    <>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext}
      />

      {/* Sidebar: Neural Playlist */}
      <aside className="w-80 border-r border-glitch-cyan/20 bg-black/40 p-6 hidden lg:flex flex-col gap-6 overflow-y-auto">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-black italic tracking-tighter glitch-text flex items-center gap-2">
            NEURAL_STREAM
          </h2>
          <div className="flex flex-col gap-1">
            {DUMMY_TRACKS.map((track, index) => (
              <button 
                key={track.id}
                onClick={() => {
                  setCurrentTrackIndex(index);
                  setIsPlaying(true);
                }}
                className={`w-full p-4 transition-all duration-100 flex items-center gap-4 text-left border
                  ${index === currentTrackIndex 
                    ? 'border-glitch-magenta bg-glitch-magenta/10 text-glitch-magenta' 
                    : 'border-glitch-cyan/10 hover:border-glitch-cyan/40 text-glitch-cyan/60'
                  }
                `}
              >
                <div className={`text-xs font-bold ${index === currentTrackIndex ? 'animate-pulse' : ''}`}>
                  [{String(index + 1).padStart(2, '0')}]
                </div>
                <div className="truncate">
                  <p className="text-sm font-black truncate">{track.title}</p>
                  <p className="text-[10px] opacity-50 uppercase tracking-[0.2em]">{track.artist.split('//')[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-4 border-2 border-glitch-cyan/20 bg-black">
          <p className="text-[10px] text-glitch-magenta uppercase mb-4 flex items-center gap-2 font-bold">
            [ DATA_VISUALIZER_01 ]
          </p>
          <div className="flex items-end gap-1 h-16">
            {[40, 80, 60, 95, 30, 50, 70, 45, 90, 30, 60, 40].map((h, i) => (
              <motion.div 
                key={i}
                animate={isPlaying ? { height: [`${h}%`, `${Math.min(100, h + 20)}%`, `${h}%`] } : { height: `${h}%` }}
                transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                className={`flex-1 ${i % 2 === 0 ? 'bg-glitch-magenta' : 'bg-glitch-cyan'}`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Main Section: Arcade Game */}
      <section className="flex-1 bg-black relative flex flex-col items-center justify-center overflow-hidden">
        {/* Score Overlay */}
        <div className="absolute top-10 left-10 z-10 pointer-events-none">
          <p className="text-xs uppercase text-glitch-magenta font-black tracking-widest">[ SCORE ]</p>
          <p className="text-6xl font-black italic glitch-text">
            {String(currentScore).padStart(6, '0')}
          </p>
        </div>
        
        <div className="absolute top-10 right-10 text-right z-10 pointer-events-none opacity-40">
          <p className="text-xs uppercase text-glitch-cyan font-black tracking-widest">[ HIGH_SCORE ]</p>
          <p className="text-3xl font-black italic">
            {String(highScore).padStart(6, '0')}
          </p>
        </div>

        <div className="relative z-10 p-1 bg-glitch-cyan/20 shadow-[0_0_100px_rgba(0,255,255,0.05)]">
          <SnakeGame 
            onScoreUpdate={onScoreUpdate} 
            onHighScoreUpdate={onHighScoreUpdate}
            externalScore={currentScore}
          />
        </div>

        <div className="absolute bottom-10 text-glitch-cyan/20 text-xs font-black tracking-[1em] animate-pulse">
          INPUT_NEEDED: ARROW_KEYS
        </div>
      </section>

      {/* Floating Bottom Bar: Music Controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6 z-30">
        <div className="cryptic-panel glitch-border bg-black/90 backdrop-blur-xl flex items-center gap-8 py-4 px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={handlePrev}
              className="text-glitch-cyan hover:text-glitch-magenta transition-colors"
            >
              <SkipBack className="w-6 h-6" />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 bg-glitch-cyan text-black flex items-center justify-center hover:bg-white transition-colors"
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-glitch-cyan hover:text-glitch-magenta transition-colors"
            >
              <SkipForward className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="flex justify-between text-[10px] mb-2 font-black tracking-widest uppercase">
              <span className="text-glitch-magenta animate-glitch truncate mr-4">{currentTrack.title}</span>
              <span className="text-glitch-cyan">
                {audioRef.current ? Math.floor(audioRef.current.currentTime / 60) : '0'}:{String(Math.floor(audioRef.current?.currentTime % 60 || 0)).padStart(2, '0')} // 
                {audioRef.current?.duration ? Math.floor(audioRef.current.duration / 60) : '0'}:{String(Math.floor(audioRef.current?.duration % 60 || 0)).padStart(2, '0')}
              </span>
            </div>
            <div 
              className="h-1 w-full bg-glitch-cyan/10 relative cursor-pointer overflow-hidden"
              onClick={handleProgressBarClick}
            >
              <motion.div 
                className="absolute top-0 left-0 h-full bg-glitch-cyan shadow-[0_0_10px_#00ffff]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Volume2 className="w-5 h-5 text-glitch-cyan" />
            <div className="w-24 h-1 bg-glitch-cyan/10 rounded-full overflow-hidden">
              <input 
                type="range" 
                min="0" 
                max="1" 
                step="0.01" 
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-full h-full bg-transparent appearance-none cursor-pointer accent-glitch-cyan"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

