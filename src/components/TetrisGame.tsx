import React, { useEffect, useRef, useState, useCallback } from 'react';

interface TetrisGameProps {
  onComplete: () => void;
}

interface Position {
  x: number;
  y: number;
}

interface Piece {
  shape: number[][];
  color: string;
  position: Position;
}

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25;

const PIECES = [
  { shape: [[1, 1, 1, 1]], color: '#00ffff' }, // I
  { shape: [[1, 1], [1, 1]], color: '#ffff00' }, // O
  { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' }, // T
  { shape: [[0, 1, 1], [1, 1, 0]], color: '#00ff00' }, // S
  { shape: [[1, 1, 0], [0, 1, 1]], color: '#ff0000' }, // Z
  { shape: [[1, 0, 0], [1, 1, 1]], color: '#ff8000' }, // J
  { shape: [[0, 0, 1], [1, 1, 1]], color: '#0000ff' }, // L
];

export const TetrisGame: React.FC<TetrisGameProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [board, setBoard] = useState<string[][]>(() => 
    Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(''))
  );
  const [currentPiece, setCurrentPiece] = useState<Piece | null>(null);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lines, setLines] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const gameLoopRef = useRef<number>();
  const lastDropRef = useRef<number>(0);

  const createNewPiece = useCallback((): Piece => {
    const pieceTemplate = PIECES[Math.floor(Math.random() * PIECES.length)];
    return {
      shape: pieceTemplate.shape,
      color: pieceTemplate.color,
      position: { x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 }
    };
  }, []);

  const isValidPosition = useCallback((piece: Piece, newPosition: Position): boolean => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = newPosition.x + x;
          const newY = newPosition.y + y;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return false;
          }
          
          if (newY >= 0 && board[newY][newX]) {
            return false;
          }
        }
      }
    }
    return true;
  }, [board]);

  const rotatePiece = useCallback((piece: Piece): number[][] => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return rotated;
  }, []);

  const placePiece = useCallback((piece: Piece): string[][] => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const boardY = piece.position.y + y;
          const boardX = piece.position.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    return newBoard;
  }, [board]);

  const clearLines = useCallback((board: string[][]): { newBoard: string[][]; linesCleared: number } => {
    const newBoard = board.filter(row => row.some(cell => !cell));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(''));
    }
    
    return { newBoard, linesCleared };
  }, []);

  const movePiece = useCallback((direction: 'left' | 'right' | 'down'): boolean => {
    if (!currentPiece || gameOver || isPaused) return false;
    
    const newPosition = { ...currentPiece.position };
    
    switch (direction) {
      case 'left':
        newPosition.x--;
        break;
      case 'right':
        newPosition.x++;
        break;
      case 'down':
        newPosition.y++;
        break;
    }
    
    if (isValidPosition(currentPiece, newPosition)) {
      setCurrentPiece({ ...currentPiece, position: newPosition });
      return true;
    }
    
    return false;
  }, [currentPiece, gameOver, isPaused, isValidPosition]);

  const dropPiece = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (!movePiece('down')) {
      const newBoard = placePiece(currentPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setLines(prev => prev + linesCleared);
      setScore(prev => prev + linesCleared * 100 * level);
      setLevel(Math.floor(lines / 10) + 1);
      
      const newPiece = createNewPiece();
      if (!isValidPosition(newPiece, newPiece.position)) {
        setGameOver(true);
      } else {
        setCurrentPiece(newPiece);
      }
    }
  }, [currentPiece, gameOver, isPaused, movePiece, placePiece, clearLines, lines, level, createNewPiece, isValidPosition]);

  const rotatePieceHandler = useCallback(() => {
    if (!currentPiece || gameOver || isPaused) return;
    
    const rotatedShape = rotatePiece(currentPiece);
    const rotatedPiece = { ...currentPiece, shape: rotatedShape };
    
    if (isValidPosition(rotatedPiece, rotatedPiece.position)) {
      setCurrentPiece(rotatedPiece);
    }
  }, [currentPiece, gameOver, isPaused, rotatePiece, isValidPosition]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        movePiece('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        movePiece('right');
        break;
      case 'ArrowDown':
        e.preventDefault();
        movePiece('down');
        break;
      case 'ArrowUp':
        e.preventDefault();
        rotatePieceHandler();
        break;
      case ' ':
        e.preventDefault();
        while (movePiece('down')) {}
        break;
      case 'p':
      case 'P':
        e.preventDefault();
        setIsPaused(prev => !prev);
        break;
      case 'Escape':
        e.preventDefault();
        onComplete();
        break;
    }
  }, [gameOver, movePiece, rotatePieceHandler, onComplete]);

  const gameLoop = useCallback((timestamp: number) => {
    if (gameOver) return;
    
    const dropInterval = Math.max(50, 500 - (level - 1) * 50);
    
    if (timestamp - lastDropRef.current > dropInterval) {
      dropPiece();
      lastDropRef.current = timestamp;
    }
    
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [gameOver, level, dropPiece]);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x]) {
          ctx.fillStyle = board[y][x];
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }
    
    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x]) {
            const drawX = (currentPiece.position.x + x) * CELL_SIZE;
            const drawY = (currentPiece.position.y + y) * CELL_SIZE;
            ctx.fillRect(drawX, drawY, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
    }
    
    // Draw grid
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, BOARD_HEIGHT * CELL_SIZE);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(BOARD_WIDTH * CELL_SIZE, y * CELL_SIZE);
      ctx.stroke();
    }
  }, [board, currentPiece]);

  useEffect(() => {
    setCurrentPiece(createNewPiece());
  }, [createNewPiece]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = requestAnimationFrame(gameLoop);
    }
    
    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameLoop, isPaused, gameOver]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="flex gap-8 items-start">
        <div className="border-2 border-green-400">
          <canvas
            ref={canvasRef}
            width={BOARD_WIDTH * CELL_SIZE}
            height={BOARD_HEIGHT * CELL_SIZE}
            className="block"
          />
        </div>
        
        <div className="text-green-400 font-mono space-y-4">
          <div>
            <div className="text-xl font-bold mb-2">TETRIS</div>
            <div>Score: {score}</div>
            <div>Level: {level}</div>
            <div>Lines: {lines}</div>
          </div>
          
          <div className="text-sm space-y-1">
            <div className="font-bold">Controls:</div>
            <div>← → Move</div>
            <div>↓ Soft Drop</div>
            <div>↑ Rotate</div>
            <div>Space: Hard Drop</div>
            <div>P: Pause</div>
            <div>Esc: Exit</div>
          </div>
          
          {isPaused && (
            <div className="text-yellow-400 font-bold">PAUSED</div>
          )}
          
          {gameOver && (
            <div className="text-red-400 font-bold">GAME OVER</div>
          )}
        </div>
      </div>
    </div>
  );
};