/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Music, Gamepad2, Github, Wifi, Radio } from 'lucide-react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const handleScoreUpdate = (newScore: number) => {
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
    }
  };

  return (
    <div id="app-root" className="min-h-screen w-full flex flex-col bg-glitch-bg text-glitch-cyan relative">
      <div className="vignette" />
      
      {/* Decoys / Background Noise */}
      <div className="absolute top-10 right-20 opacity-10 select-none pointer-events-none text-xs">
        [ SYSTEM_ERROR_LOG_V4.02 ]<br />
        0x45A1 // CORE_OVERLOAD<br />
        0x45A2 // BUFFER_OVERFLOW<br />
        RETRYING_CONNECTION...
      </div>

      <header id="main-header" className="p-8 border-b border-glitch-cyan/20 flex flex-col md:flex-row items-center justify-between gap-6 z-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 glitch-border flex items-center justify-center bg-black">
            <Radio className="text-glitch-magenta w-8 h-8 animate-glitch" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tighter glitch-text">
              ARCADE_INTERFACE.V1
            </h1>
            <p className="text-[10px] text-glitch-magenta/60 font-bold">STATUS: OPERATIONAL // USER: ANONYMOUS</p>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right hidden md:block">
            <div className="text-[10px] text-glitch-magenta font-bold">UPLINK_STATUS</div>
            <div className="flex items-center gap-2 justify-end">
              <Wifi className="w-3 h-3 animate-pulse" />
              <span className="text-sm">ENCRYPTED // 2048-BIT</span>
            </div>
          </div>
          <div className="h-10 w-px bg-glitch-cyan/20" />
          <div className="flex gap-2">
            <div className="px-3 py-1 bg-glitch-cyan text-black font-black text-xs">01_MUSIC</div>
            <div className="px-3 py-1 border border-glitch-magenta text-glitch-magenta font-black text-xs hover:bg-glitch-magenta/10 cursor-help">02_SNAKE</div>
          </div>
        </div>
      </header>

      <main id="main-content" className="flex-1 flex overflow-hidden z-10">
        <MusicPlayer 
          onScoreUpdate={handleScoreUpdate} 
          currentScore={score} 
          highScore={highScore} 
          onHighScoreUpdate={setHighScore}
        />
      </main>

      <footer className="p-4 border-t border-glitch-cyan/20 flex justify-between items-center text-[10px] text-glitch-cyan/30 font-bold z-10">
        <div>[ SERIAL: AX-9921-KB ]</div>
        <div className="animate-pulse">SYSTEM_LISTENING...</div>
        <div>[ REV: 2026.04.29 ]</div>
      </footer>
    </div>
  );
}

