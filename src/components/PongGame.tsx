import React, { useEffect, useRef, useState, useCallback } from 'react';

interface PongGameProps {
  onComplete: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
  speed: number;
}

interface Paddle {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
}

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 5;
const INITIAL_BALL_SPEED = 3;

export const PongGame: React.FC<PongGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  
  const [leftPaddle, setLeftPaddle] = useState<Paddle>({
    x: 20,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED
  });
  
  const [rightPaddle, setRightPaddle] = useState<Paddle>({
    x: CANVAS_WIDTH - 30,
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    speed: PADDLE_SPEED
  });
  
  const [ball, setBall] = useState<Ball>({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    speed: INITIAL_BALL_SPEED
  });
  
  const [leftScore, setLeftScore] = useState(0);
  const [rightScore, setRightScore] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'paused' | 'gameOver'>('playing');
  const [winner, setWinner] = useState<string>('');
  
  const keysPressed = useRef<Set<string>>(new Set());

  const resetBall = useCallback(() => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      dy: INITIAL_BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
      speed: INITIAL_BALL_SPEED
    });
  }, []);

  const checkCollision = useCallback((ball: Ball, paddle: Paddle): boolean => {
    return ball.x < paddle.x + paddle.width &&
           ball.x + BALL_SIZE > paddle.x &&
           ball.y < paddle.y + paddle.height &&
           ball.y + BALL_SIZE > paddle.y;
  }, []);

  const updateGame = useCallback(() => {
    if (gameState !== 'playing') return;

    setBall(prevBall => {
      let newBall = { ...prevBall };
      
      // Move ball
      newBall.x += newBall.dx;
      newBall.y += newBall.dy;
      
      // Ball collision with top and bottom walls
      if (newBall.y <= 0 || newBall.y >= CANVAS_HEIGHT - BALL_SIZE) {
        newBall.dy = -newBall.dy;
      }
      
      // Ball collision with paddles
      if (checkCollision(newBall, leftPaddle)) {
        if (newBall.dx < 0) {
          newBall.dx = -newBall.dx;
          newBall.x = leftPaddle.x + leftPaddle.width;
          // Add some randomness to the angle
          newBall.dy += (Math.random() - 0.5) * 2;
        }
      }
      
      if (checkCollision(newBall, rightPaddle)) {
        if (newBall.dx > 0) {
          newBall.dx = -newBall.dx;
          newBall.x = rightPaddle.x - BALL_SIZE;
          // Add some randomness to the angle
          newBall.dy += (Math.random() - 0.5) * 2;
        }
      }
      
      // Ball goes off screen - score
      if (newBall.x < 0) {
        setRightScore(prev => {
          const newScore = prev + 1;
          if (newScore >= 10) {
            setWinner('Right Player');
            setGameState('gameOver');
          }
          return newScore;
        });
        resetBall();
        return ball; // Return original ball to trigger reset
      }
      
      if (newBall.x > CANVAS_WIDTH) {
        setLeftScore(prev => {
          const newScore = prev + 1;
          if (newScore >= 10) {
            setWinner('Left Player');
            setGameState('gameOver');
          }
          return newScore;
        });
        resetBall();
        return ball; // Return original ball to trigger reset
      }
      
      return newBall;
    });

    // Update paddles based on keys pressed
    setLeftPaddle(prev => {
      let newY = prev.y;
      if (keysPressed.current.has('w') && newY > 0) {
        newY -= prev.speed;
      }
      if (keysPressed.current.has('s') && newY < CANVAS_HEIGHT - prev.height) {
        newY += prev.speed;
      }
      return { ...prev, y: newY };
    });

    setRightPaddle(prev => {
      let newY = prev.y;
      if (keysPressed.current.has('ArrowUp') && newY > 0) {
        newY -= prev.speed;
      }
      if (keysPressed.current.has('ArrowDown') && newY < CANVAS_HEIGHT - prev.height) {
        newY += prev.speed;
      }
      return { ...prev, y: newY };
    });
  }, [gameState, leftPaddle, rightPaddle, checkCollision, resetBall, ball]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw center line
    ctx.strokeStyle = '#0f4';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#0f4';
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
    
    // Draw ball
    ctx.fillRect(ball.x, ball.y, BALL_SIZE, BALL_SIZE);
    
    // Draw scores
    ctx.font = '48px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(leftScore.toString(), CANVAS_WIDTH / 4, 60);
    ctx.fillText(rightScore.toString(), (3 * CANVAS_WIDTH) / 4, 60);
    
    // Draw game state messages
    if (gameState === 'paused') {
      ctx.font = '32px monospace';
      ctx.fillText('PAUSED', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '16px monospace';
      ctx.fillText('Press P to resume', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
    
    if (gameState === 'gameOver') {
      ctx.font = '32px monospace';
      ctx.fillText('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
      ctx.font = '24px monospace';
      ctx.fillText(`${winner} Wins!`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
      ctx.font = '16px monospace';
      ctx.fillText('Press R to restart or ESC to exit', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    }
  }, [leftPaddle, rightPaddle, ball, leftScore, rightScore, gameState, winner]);

  const gameLoop = useCallback(() => {
    updateGame();
    draw();
    animationRef.current = requestAnimationFrame(gameLoop);
  }, [updateGame, draw]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    keysPressed.current.add(e.key.toLowerCase());
    keysPressed.current.add(e.key);
    
    if (e.key === 'Escape') {
      onComplete();
    } else if (e.key.toLowerCase() === 'p') {
      setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
    } else if (e.key.toLowerCase() === 'r' && gameState === 'gameOver') {
      // Restart game
      setLeftScore(0);
      setRightScore(0);
      setWinner('');
      setGameState('playing');
      resetBall();
      setLeftPaddle(prev => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }));
      setRightPaddle(prev => ({ ...prev, y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2 }));
    }
  }, [onComplete, gameState, resetBall]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    keysPressed.current.delete(e.key.toLowerCase());
    keysPressed.current.delete(e.key);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(gameLoop);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameLoop]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="text-green-400 font-mono text-2xl font-bold">
          PONG
        </div>
        
        <div className="border-2 border-green-400">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="block"
          />
        </div>
        
        <div className="text-green-400 font-mono text-sm space-y-1 text-center">
          <div className="grid grid-cols-2 gap-8 mb-2">
            <div>
              <div className="font-bold">Left Player</div>
              <div>W - Up</div>
              <div>S - Down</div>
            </div>
            <div>
              <div className="font-bold">Right Player</div>
              <div>↑ - Up</div>
              <div>↓ - Down</div>
            </div>
          </div>
          <div className="border-t border-green-800 pt-2">
            <div>P - Pause/Resume</div>
            <div>R - Restart (when game over)</div>
            <div>ESC - Exit</div>
            <div className="text-xs opacity-70 mt-1">First to 10 points wins!</div>
          </div>
        </div>
      </div>
    </div>
  );
};