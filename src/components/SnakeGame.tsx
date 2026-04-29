import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gamepad2, RotateCcw, Trophy } from 'lucide-react';
import { Direction, Point } from '../types';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

interface SnakeGameProps {
  onScoreUpdate: (score: number) => void;
  onHighScoreUpdate: (score: number) => void;
  externalScore: number;
}

export default function SnakeGame({ onScoreUpdate, onHighScoreUpdate, externalScore }: SnakeGameProps) {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  
  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (currentSnake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(generateFood([{ x: 10, y: 10 }]));
    setDirection('RIGHT');
    setIsGameOver(false);
    onScoreUpdate(0);
    setIsPaused(false);
    setIsGameStarted(true);
  };

  const moveSnake = useCallback(() => {
    if (isGameOver || isPaused || !isGameStarted) return;

    setSnake(prevSnake => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 || newHead.x >= GRID_SIZE ||
        newHead.y < 0 || newHead.y >= GRID_SIZE ||
        prevSnake.some(segment => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        onScoreUpdate(externalScore + 10);
        setFood(generateFood(newSnake));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, isGameStarted, externalScore, onScoreUpdate, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (isGameStarted && !isGameOver && !isPaused) {
      const speed = Math.max(50, INITIAL_SPEED - (externalScore / 10) * SPEED_INCREMENT);
      gameLoopRef.current = setInterval(moveSnake, speed);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [moveSnake, isGameStarted, isGameOver, isPaused, externalScore]);

  return (
    <div className="relative p-4 bg-black border-2 border-glitch-cyan shadow-[0_0_50px_rgba(0,255,255,0.1)]">
      <div className="absolute -top-3 left-4 bg-black px-2 text-[10px] text-glitch-cyan font-bold tracking-widest">
        [ MATRIX_GRID_v4.0 ]
      </div>
      
      <div 
        className="grid gap-[1px] bg-glitch-cyan/5 overflow-hidden"
        style={{ 
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          width: 'min(75vw, 500px)',
          aspectRatio: '1/1'
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => {
          const x = i % GRID_SIZE;
          const y = Math.floor(i / GRID_SIZE);
          const isSnakeHead = snake[0].x === x && snake[0].y === y;
          const isSnakeBody = snake.slice(1).some(s => s.x === x && s.y === y);
          const isFood = food.x === x && food.y === y;

          return (
            <div 
              key={i} 
              className={`
                w-full h-full snake-cell
                ${isSnakeHead ? 'snake-head' : ''}
                ${isSnakeBody ? 'snake-body' : ''}
                ${isFood ? 'food' : ''}
              `}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {!isGameStarted && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
          >
            <Gamepad2 className="w-20 h-20 text-glitch-cyan mb-6 animate-glitch" />
            <h2 className="text-4xl font-black italic tracking-tighter mb-8 glitch-text">[[ START_SIMULATION ]]</h2>
            <button 
              onClick={resetGame}
              className="px-12 py-4 bg-glitch-cyan text-black font-black uppercase tracking-[0.2em] hover:bg-white transition-colors"
            >
              INITIALIZE_CORE
            </button>
          </motion.div>
        )}

        {isGameOver && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 backdrop-blur-md"
          >
            <Trophy className="w-24 h-24 text-glitch-magenta mb-4 animate-glitch" />
            <h2 className="text-5xl font-black mb-4 text-glitch-magenta italic tracking-tighter glitch-text">[[ SYSTEM_CRASHED ]]</h2>
            <p className="text-white font-bold mb-12 tracking-[0.3em] uppercase opacity-40">FRAGMENT_ID: {externalScore}</p>
            <button 
              onClick={resetGame}
              className="px-12 py-4 border-2 border-glitch-magenta text-glitch-magenta font-black uppercase tracking-widest hover:bg-glitch-magenta/10 transition-all"
            >
              RECOVERY_PROTOCOLS
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

