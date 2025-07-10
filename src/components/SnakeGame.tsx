import React, { useEffect, useRef, useState, useCallback } from 'react';

interface SnakeGameProps {
  onComplete: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface GameState {
  snake: Position[];
  food: Position;
  direction: Position;
  score: number;
  gameOver: boolean;
  isPaused: boolean;
}

const BOARD_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE: Position[] = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 }
];

const DIRECTIONS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 }
};

export const SnakeGame: React.FC<SnakeGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number>();
  const lastMoveRef = useRef<number>(0);

  const [gameState, setGameState] = useState<GameState>({
    snake: INITIAL_SNAKE,
    food: { x: 15, y: 15 },
    direction: DIRECTIONS.RIGHT,
    score: 0,
    gameOver: false,
    isPaused: false
  });

  const generateFood = useCallback((snake: Position[]): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * BOARD_SIZE),
        y: Math.floor(Math.random() * BOARD_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  const checkCollision = useCallback((head: Position, snake: Position[]): boolean => {
    // Wall collision
    if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE) {
      return true;
    }
    
    // Self collision
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
  }, []);

  const moveSnake = useCallback(() => {
    if (gameState.gameOver || gameState.isPaused) return;

    setGameState(prevState => {
      const { snake, food, direction, score } = prevState;
      const head = snake[0];
      const newHead = {
        x: head.x + direction.x,
        y: head.y + direction.y
      };

      if (checkCollision(newHead, snake)) {
        return { ...prevState, gameOver: true };
      }

      const newSnake = [newHead, ...snake];
      let newFood = food;
      let newScore = score;

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        newScore += 10;
        newFood = generateFood(newSnake);
      } else {
        newSnake.pop(); // Remove tail if no food eaten
      }

      return {
        ...prevState,
        snake: newSnake,
        food: newFood,
        score: newScore
      };
    });
  }, [gameState.gameOver, gameState.isPaused, checkCollision, generateFood]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameState.gameOver) {
      if (e.key.toLowerCase() === 'r') {
        // Restart game
        setGameState({
          snake: INITIAL_SNAKE,
          food: { x: 15, y: 15 },
          direction: DIRECTIONS.RIGHT,
          score: 0,
          gameOver: false,
          isPaused: false
        });
      } else if (e.key === 'Escape') {
        onComplete();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (gameState.direction.y === 0) { // Prevent reverse direction
          setGameState(prev => ({ ...prev, direction: DIRECTIONS.UP }));
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (gameState.direction.y === 0) {
          setGameState(prev => ({ ...prev, direction: DIRECTIONS.DOWN }));
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (gameState.direction.x === 0) {
          setGameState(prev => ({ ...prev, direction: DIRECTIONS.LEFT }));
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (gameState.direction.x === 0) {
          setGameState(prev => ({ ...prev, direction: DIRECTIONS.RIGHT }));
        }
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        setGameState(prev => ({ ...prev, isPaused: !prev.isPaused }));
        break;
      case 'Escape':
        e.preventDefault();
        onComplete();
        break;
    }
  }, [gameState.direction, gameState.gameOver, onComplete]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, BOARD_SIZE * CELL_SIZE);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(BOARD_SIZE * CELL_SIZE, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    gameState.snake.forEach((segment, index) => {
      ctx.fillStyle = index === 0 ? '#0f4' : '#090'; // Head is brighter
      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
    });

    // Draw food
    ctx.fillStyle = '#f40';
    ctx.fillRect(
      gameState.food.x * CELL_SIZE + 1,
      gameState.food.y * CELL_SIZE + 1,
      CELL_SIZE - 2,
      CELL_SIZE - 2
    );
  }, [gameState]);

  const gameLoop = useCallback((timestamp: number) => {
    const moveInterval = Math.max(100, 200 - Math.floor(gameState.score / 50) * 10); // Speed increases with score

    if (timestamp - lastMoveRef.current > moveInterval) {
      moveSnake();
      lastMoveRef.current = timestamp;
    }

    draw();
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [moveSnake, draw, gameState.score]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!gameState.gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, gameState.gameOver]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="flex gap-8 items-start">
        <div className="border-2 border-green-400">
          <canvas
            ref={canvasRef}
            width={BOARD_SIZE * CELL_SIZE}
            height={BOARD_SIZE * CELL_SIZE}
            className="block"
          />
        </div>
        
        <div className="text-green-400 font-mono space-y-4">
          <div>
            <div className="text-xl font-bold mb-2">SNAKE</div>
            <div>Score: {gameState.score}</div>
            <div>Length: {gameState.snake.length}</div>
          </div>
          
          <div className="text-sm space-y-1">
            <div className="font-bold">Controls:</div>
            <div>↑ ↓ ← → Move</div>
            <div>P - Pause/Resume</div>
            <div>R - Restart (when game over)</div>
            <div>ESC - Exit</div>
          </div>
          
          <div className="text-xs opacity-70">
            <div>Eat the red food to grow!</div>
            <div>Don't hit walls or yourself!</div>
            <div>Speed increases with score!</div>
          </div>
          
          {gameState.isPaused && (
            <div className="text-yellow-400 font-bold">PAUSED</div>
          )}
          
          {gameState.gameOver && (
            <div className="text-red-400 space-y-1">
              <div className="font-bold">GAME OVER</div>
              <div className="text-sm">Final Score: {gameState.score}</div>
              <div className="text-sm">Press R to restart</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};