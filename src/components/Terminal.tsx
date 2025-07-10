import React, { useEffect, useRef, useState } from 'react';
import { useTerminal, getPrompt } from '../hooks/useTerminal';
import { Terminal as TerminalIcon } from 'lucide-react';

const Terminal: React.FC = () => {
  const { state, input, setInput, isProcessing, handleKeyDown, focusInput, inputRef } = useTerminal();
  const outputRef = useRef<HTMLDivElement>(null);
  const [showMatrix, setShowMatrix] = useState(false);
  const [gameState, setGameState] = useState<any>(null);
  const [gameType, setGameType] = useState<string | null>(null);

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [state.output]);

  const formatOutput = (content: string) => {
    // Handle multi-line content and preserve formatting
    return content.split('\n').map((line, index) => (
      <div key={index} className={line.trim() === '' ? 'h-4' : ''}>
        {line || '\u00A0'}
      </div>
    ));
  };

  // Matrix effect component
  const MatrixRain = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
      const matrixArray = matrix.split("");

      const fontSize = 10;
      const columns = canvas.width / fontSize;

      const drops: number[] = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }

      const draw = () => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';

        for (let i = 0; i < drops.length; i++) {
          const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);

          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          drops[i]++;
        }
      };

      const interval = setInterval(draw, 35);

      const handleResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      };

      window.addEventListener('resize', handleResize);

      return () => {
        clearInterval(interval);
        window.removeEventListener('resize', handleResize);
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-50 bg-black"
        onClick={() => setShowMatrix(false)}
      />
    );
  };

  // Snake Game Component
  const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 15, y: 15 });
    const [direction, setDirection] = useState({ x: 0, y: 1 });
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case 'w': 
          case 'arrowup':
            setDirection(prev => prev.y !== 1 ? { x: 0, y: -1 } : prev); 
            break;
          case 's': 
          case 'arrowdown':
            setDirection(prev => prev.y !== -1 ? { x: 0, y: 1 } : prev); 
            break;
          case 'a': 
          case 'arrowleft':
            setDirection(prev => prev.x !== 1 ? { x: -1, y: 0 } : prev); 
            break;
          case 'd': 
          case 'arrowright':
            setDirection(prev => prev.x !== -1 ? { x: 1, y: 0 } : prev); 
            break;
          case 'q': 
          case 'escape':
            setGameType(null); 
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
      if (gameOver) return;

      const gameLoop = setInterval(() => {
        setSnake(currentSnake => {
          const newSnake = [...currentSnake];
          const head = { ...newSnake[0] };
          head.x += direction.x;
          head.y += direction.y;

          // Check walls
          if (head.x < 0 || head.x >= 30 || head.y < 0 || head.y >= 15) {
            setGameOver(true);
            return currentSnake;
          }

          // Check self collision
          if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
            setGameOver(true);
            return currentSnake;
          }

          newSnake.unshift(head);

          // Check food
          if (head.x === food.x && head.y === food.y) {
            setScore(s => s + 1);
            setFood({
              x: Math.floor(Math.random() * 30),
              y: Math.floor(Math.random() * 15)
            });
          } else {
            newSnake.pop();
          }

          return newSnake;
        });
      }, 200);

      return () => clearInterval(gameLoop);
    }, [direction, food, gameOver]);

    const renderGame = () => {
      const grid = Array(15).fill(null).map(() => Array(30).fill(' '));
      
      snake.forEach(segment => {
        if (segment.y >= 0 && segment.y < 15 && segment.x >= 0 && segment.x < 30) {
          grid[segment.y][segment.x] = '●';
        }
      });
      
      if (food.y >= 0 && food.y < 15 && food.x >= 0 && food.x < 30) {
        grid[food.y][food.x] = '○';
      }

      return grid.map(row => '█' + row.join('') + '█').join('\n');
    };

    return (
      <div className="font-mono text-green-400 text-center">
        <div className="mb-4">
          🐍 SNAKE GAME 🐍
          <br />
          Score: {score} | {gameOver ? 'GAME OVER!' : 'Playing...'}
          <br />
          WASD/Arrow Keys to move, Q/ESC to quit
        </div>
        <div className="border border-green-400 p-2 inline-block">
          <div className="text-green-400">{'█'.repeat(32)}</div>
          <pre className="text-green-400">{renderGame()}</pre>
          <div className="text-green-400">{'█'.repeat(32)}</div>
        </div>
        {gameOver && (
          <div className="mt-2 text-red-400">
            🎮 Game Over! Final Score: {score} 🎮
            <br />
            Press Q or ESC to return to terminal
          </div>
        )}
      </div>
    );
  };

  // Tetris Game Component
  const TetrisGame = () => {
    const [board, setBoard] = useState(() => 
      Array(20).fill(null).map(() => Array(10).fill(0))
    );
    const [currentPiece, setCurrentPiece] = useState({
      shape: [[1, 1], [1, 1]], // O piece
      x: 4,
      y: 0
    });
    const [score, setScore] = useState(0);
    const [lines, setLines] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const pieces = [
      [[1, 1], [1, 1]], // O
      [[1, 1, 1, 1]], // I
      [[1, 1, 1], [0, 1, 0]], // T
      [[1, 1, 1], [1, 0, 0]], // L
      [[1, 1, 1], [0, 0, 1]], // J
      [[0, 1, 1], [1, 1, 0]], // S
      [[1, 1, 0], [0, 1, 1]], // Z
    ];

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        if (gameOver) {
          if (e.key.toLowerCase() === 'q' || e.key === 'Escape') setGameType(null);
          return;
        }

        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case 'a': 
          case 'arrowleft':
            setCurrentPiece(piece => {
              const newX = piece.x - 1;
              if (newX >= 0 && !checkCollision(piece.shape, newX, piece.y)) {
                return { ...piece, x: newX };
              }
              return piece;
            });
            break;
          case 'd': 
          case 'arrowright':
            setCurrentPiece(piece => {
              const newX = piece.x + 1;
              if (newX + piece.shape[0].length <= 10 && !checkCollision(piece.shape, newX, piece.y)) {
                return { ...piece, x: newX };
              }
              return piece;
            });
            break;
          case 's': 
          case 'arrowdown':
            setCurrentPiece(piece => {
              const newY = piece.y + 1;
              if (!checkCollision(piece.shape, piece.x, newY)) {
                return { ...piece, y: newY };
              }
              return piece;
            });
            break;
          case 'w':
          case 'arrowup':
            setCurrentPiece(piece => {
              const rotated = piece.shape[0].map((_, i) => 
                piece.shape.map(row => row[i]).reverse()
              );
              if (!checkCollision(rotated, piece.x, piece.y)) {
                return { ...piece, shape: rotated };
              }
              return piece;
            });
            break;
          case 'q': 
          case 'escape':
            setGameType(null); 
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, [gameOver]);

    const checkCollision = (shape: number[][], x: number, y: number) => {
      for (let dy = 0; dy < shape.length; dy++) {
        for (let dx = 0; dx < shape[dy].length; dx++) {
          if (shape[dy][dx]) {
            const newX = x + dx;
            const newY = y + dy;
            if (newX < 0 || newX >= 10 || newY >= 20 || (newY >= 0 && board[newY][newX])) {
              return true;
            }
          }
        }
      }
      return false;
    };

    useEffect(() => {
      if (gameOver) return;

      const gameLoop = setInterval(() => {
        setCurrentPiece(piece => {
          const newY = piece.y + 1;
          if (checkCollision(piece.shape, piece.x, newY)) {
            // Place piece
            setBoard(currentBoard => {
              const newBoard = [...currentBoard];
              piece.shape.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                  if (cell && piece.y + dy >= 0) {
                    newBoard[piece.y + dy][piece.x + dx] = 1;
                  }
                });
              });

              // Check for completed lines
              const completedLines = [];
              for (let y = 0; y < 20; y++) {
                if (newBoard[y].every(cell => cell === 1)) {
                  completedLines.push(y);
                }
              }

              // Remove completed lines
              completedLines.forEach(lineY => {
                newBoard.splice(lineY, 1);
                newBoard.unshift(Array(10).fill(0));
              });

              if (completedLines.length > 0) {
                setLines(l => l + completedLines.length);
                setScore(s => s + completedLines.length * 100);
              }

              return newBoard;
            });
            
            // Generate new piece
            const newPiece = pieces[Math.floor(Math.random() * pieces.length)];
            const newPieceObj = { shape: newPiece, x: 4, y: 0 };
            
            if (checkCollision(newPiece, 4, 0)) {
              setGameOver(true);
            }
            
            return newPieceObj;
          }
          return { ...piece, y: newY };
        });
      }, 600);

      return () => clearInterval(gameLoop);
    }, [board, gameOver]);

    const renderGame = () => {
      const displayBoard = board.map(row => [...row]);
      
      // Add current piece to display
      currentPiece.shape.forEach((row, dy) => {
        row.forEach((cell, dx) => {
          if (cell && currentPiece.y + dy < 20 && currentPiece.y + dy >= 0) {
            displayBoard[currentPiece.y + dy][currentPiece.x + dx] = 2;
          }
        });
      });

      return displayBoard.map(row => 
        '█' + row.map(cell => cell === 0 ? ' ' : cell === 1 ? '█' : '▓').join('') + '█'
      ).join('\n');
    };

    return (
      <div className="font-mono text-green-400 text-center">
        <div className="mb-4">
          🧩 TETRIS 🧩
          <br />
          Score: {score} | Lines: {lines} | {gameOver ? 'GAME OVER!' : 'Playing...'}
          <br />
          WASD/Arrow Keys to move/rotate, Q/ESC to quit
        </div>
        <div className="border border-green-400 p-2 inline-block">
          <div className="text-green-400">{'█'.repeat(12)}</div>
          <pre className="text-green-400">{renderGame()}</pre>
          <div className="text-green-400">{'█'.repeat(12)}</div>
        </div>
        {gameOver && (
          <div className="mt-2 text-red-400">
            🎮 Game Over! Final Score: {score} 🎮
            <br />
            Lines Cleared: {lines}
            <br />
            Press Q or ESC to return to terminal
          </div>
        )}
      </div>
    );
  };

  // Pong Game Component
  const PongGame = () => {
    const [leftPaddle, setLeftPaddle] = useState(8);
    const [rightPaddle, setRightPaddle] = useState(8);
    const [ball, setBall] = useState({ x: 20, y: 8, dx: 1, dy: 1 });
    const [score, setScore] = useState({ left: 0, right: 0 });
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
      const handleKeyPress = (e: KeyboardEvent) => {
        e.preventDefault();
        switch (e.key.toLowerCase()) {
          case 'w':
            setLeftPaddle(p => Math.max(1, p - 1));
            break;
          case 's':
            setLeftPaddle(p => Math.min(14, p + 1));
            break;
          case 'arrowup':
            setRightPaddle(p => Math.max(1, p - 1));
            break;
          case 'arrowdown':
            setRightPaddle(p => Math.min(14, p + 1));
            break;
          case 'q':
          case 'escape':
            setGameType(null);
            break;
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }, []);

    useEffect(() => {
      if (gameOver) return;

      const gameLoop = setInterval(() => {
        setBall(currentBall => {
          let newBall = { ...currentBall };
          newBall.x += newBall.dx;
          newBall.y += newBall.dy;

          // Top/bottom walls
          if (newBall.y <= 0 || newBall.y >= 15) {
            newBall.dy = -newBall.dy;
          }

          // Left paddle
          if (newBall.x <= 2 && newBall.y >= leftPaddle - 1 && newBall.y <= leftPaddle + 1) {
            newBall.dx = -newBall.dx;
          }

          // Right paddle
          if (newBall.x >= 37 && newBall.y >= rightPaddle - 1 && newBall.y <= rightPaddle + 1) {
            newBall.dx = -newBall.dx;
          }

          // Score
          if (newBall.x <= 0) {
            setScore(s => ({ ...s, right: s.right + 1 }));
            newBall = { x: 20, y: 8, dx: 1, dy: 1 };
          } else if (newBall.x >= 39) {
            setScore(s => ({ ...s, left: s.left + 1 }));
            newBall = { x: 20, y: 8, dx: -1, dy: 1 };
          }

          return newBall;
        });
      }, 100);

      return () => clearInterval(gameLoop);
    }, [leftPaddle, rightPaddle, gameOver]);

    const renderGame = () => {
      const grid = Array(16).fill(null).map(() => Array(40).fill(' '));
      
      // Paddles
      for (let i = -1; i <= 1; i++) {
        if (leftPaddle + i >= 0 && leftPaddle + i < 16) {
          grid[leftPaddle + i][1] = '█';
        }
        if (rightPaddle + i >= 0 && rightPaddle + i < 16) {
          grid[rightPaddle + i][38] = '█';
        }
      }
      
      // Ball
      if (ball.y >= 0 && ball.y < 16 && ball.x >= 0 && ball.x < 40) {
        grid[ball.y][ball.x] = '●';
      }

      return grid.map(row => '█' + row.join('') + '█').join('\n');
    };

    return (
      <div className="font-mono text-green-400 text-center">
        <div className="mb-4">
          🏓 PONG 🏓
          <br />
          Player 1: {score.left} | Player 2: {score.right}
          <br />
          W/S for left paddle, ↑/↓ for right paddle, Q/ESC to quit
        </div>
        <div className="border border-green-400 p-2 inline-block">
          <div className="text-green-400">{'█'.repeat(42)}</div>
          <pre className="text-green-400">{renderGame()}</pre>
          <div className="text-green-400">{'█'.repeat(42)}</div>
        </div>
      </div>
    );
  };

  // Listen for matrix command
  useEffect(() => {
    const lastOutput = state.output[state.output.length - 1];
    if (lastOutput?.content.includes('MATRIX MODE ACTIVATED')) {
      setShowMatrix(true);
      setTimeout(() => setShowMatrix(false), 10000);
    }
    
    // Check for game commands
    if (lastOutput?.content.includes('🐍 SNAKE GAME 🐍') && lastOutput?.content.includes('WASD to move')) {
      setGameType('snake');
    } else if (lastOutput?.content.includes('🧩 TETRIS 🧩') && lastOutput?.content.includes('WASD to move/rotate')) {
      setGameType('tetris');
    } else if (lastOutput?.content.includes('🏓 PONG 🏓') && lastOutput?.content.includes('W/S for left paddle')) {
      setGameType('pong');
    }
  }, [state.output]);

  // Game overlay
  const renderGameOverlay = () => {
    switch (gameType) {
      case 'snake':
        return <SnakeGame />;
      case 'tetris':
        return <TetrisGame />;
      case 'pong':
        return <PongGame />;
      default:
        return null;
    }
  };

  return (
    <>
      {showMatrix && <MatrixRain />}
      {gameType && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-95 flex items-center justify-center">
          <div className="bg-black border border-green-400 p-4 rounded max-w-4xl">
            {renderGameOverlay()}
          </div>
        </div>
      )}
      <div className="min-h-screen bg-black text-green-400 font-mono flex flex-col">
        {/* Terminal Header */}
        <div className="bg-gray-900 border-b border-gray-700 px-4 py-2 flex items-center gap-2">
          <TerminalIcon size={16} />
          <span className="text-sm">Terminal Shell</span>
          <div className="flex gap-1 ml-auto">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>

        {/* Terminal Content */}
        <div className="flex-1 flex flex-col p-4 overflow-hidden" onClick={focusInput}>
          {/* Output Area */}
          <div 
            ref={outputRef}
            className="flex-1 overflow-y-auto mb-4 space-y-1"
            style={{ scrollBehavior: 'smooth' }}
          >
            {state.output.map((line) => (
              <div key={line.id} className="whitespace-pre-wrap">
                {line.type === 'command' ? (
                  <div className="text-green-400">
                    {formatOutput(line.content)}
                  </div>
                ) : line.type === 'error' ? (
                  <div className="text-red-400">
                    {formatOutput(line.content)}
                  </div>
                ) : (
                  <div className="text-green-400">
                    {formatOutput(line.content)}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div className="flex items-center">
            <span className="text-green-400 mr-2 whitespace-nowrap">
              {getPrompt(state.currentPath)}
            </span>
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isProcessing}
                className="w-full bg-transparent text-green-400 outline-none font-mono"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
              />
              {/* Standard blinking terminal cursor */}
              <span 
                className="absolute top-0 text-green-400 pointer-events-none animate-pulse"
                style={{ 
                  left: `${input.length * 0.6}em`
                }}
              >
                <Cursor />
              </span>
            </div>
          </div>

          {isProcessing && (
            <div className="mt-2 text-green-600 animate-pulse">
              Processing...
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-900 border-t border-gray-700 px-4 py-2 text-xs text-gray-500">
          <div className="flex justify-between items-center">
            <span>Terminal Shell | Type 'help' for commands</span>
            <span>Press Ctrl+C to interrupt | Tab for autocomplete</span>
          </div>
        </div>
      </div>
    </>
  );
};

const Cursor: React.FC = () => {
  return (
    <span className="inline-block w-0.5 h-5 bg-green-400">
      |
    </span>
  );
};

export default Terminal;