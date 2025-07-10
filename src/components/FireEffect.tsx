import React, { useEffect, useRef } from 'react';

interface FireEffectProps {
  onComplete: () => void;
}

export const FireEffect: React.FC<FireEffectProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fire characters and symbols
    const fireChars = ['▲', '▼', '◆', '♦', '●', '◉', '▪', '▫', '█', '▓', '▒', '░', '*', '+', '~', '^'];
    const width = canvas.width;
    const height = canvas.height;
    const cellSize = 6;
    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);
    
    // Fire buffer - represents heat intensity
    const fireBuffer: number[][] = [];
    for (let y = 0; y < rows; y++) {
      fireBuffer[y] = [];
      for (let x = 0; x < cols; x++) {
        fireBuffer[y][x] = 0;
      }
    }

    // Initialize bottom row with maximum heat
    for (let x = 0; x < cols; x++) {
      fireBuffer[rows - 1][x] = Math.random() > 0.3 ? 255 : 0;
    }

    let animationId: number;
    let startTime = Date.now();
    const duration = 6000; // 6 seconds

    const getFireColor = (intensity: number): string => {
      if (intensity < 50) return `rgba(0, 0, 0, ${intensity / 50})`;
      if (intensity < 100) return `rgba(${intensity * 2}, 0, 0, 1)`;
      if (intensity < 150) return `rgba(255, ${(intensity - 100) * 3}, 0, 1)`;
      if (intensity < 200) return `rgba(255, 255, ${(intensity - 150) * 3}, 1)`;
      return `rgba(255, 255, 255, 1)`;
    };

    const draw = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, width, height);

      // Update fire simulation
      for (let y = rows - 2; y >= 0; y--) {
        for (let x = 0; x < cols; x++) {
          // Calculate new heat value based on surrounding cells
          let heat = 0;
          let count = 0;
          
          // Sample from below and sides
          for (let dy = 1; dy <= 2; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
              const ny = y + dy;
              const nx = x + dx;
              if (ny < rows && nx >= 0 && nx < cols) {
                heat += fireBuffer[ny][nx];
                count++;
              }
            }
          }
          
          // Average heat with some cooling and randomness
          heat = heat / count;
          heat -= Math.random() * 30 + 10; // Cooling factor
          heat = Math.max(0, Math.min(255, heat));
          
          fireBuffer[y][x] = heat;
        }
      }

      // Keep bottom row hot (fuel source)
      for (let x = 0; x < cols; x++) {
        if (progress < 0.8) { // Reduce fuel towards the end
          fireBuffer[rows - 1][x] = Math.random() > 0.2 ? 200 + Math.random() * 55 : 0;
        } else {
          fireBuffer[rows - 1][x] *= 0.9; // Gradually extinguish
        }
      }

      // Draw fire
      ctx.font = `${cellSize}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const intensity = fireBuffer[y][x];
          if (intensity > 20) {
            const char = fireChars[Math.floor(Math.random() * fireChars.length)];
            ctx.fillStyle = getFireColor(intensity);
            ctx.fillText(
              char,
              x * cellSize + cellSize / 2,
              y * cellSize + cellSize / 2
            );
          }
        }
      }

      // Add some sparks
      if (Math.random() > 0.7) {
        ctx.fillStyle = `rgba(255, 255, 100, ${Math.random()})`;
        const sparkX = Math.random() * width;
        const sparkY = height - Math.random() * height * 0.6;
        ctx.fillText('*', sparkX, sparkY);
      }

      if (progress < 1) {
        animationId = requestAnimationFrame(draw);
      } else {
        onComplete();
      }
    };

    animationId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-50 bg-black"
      style={{ pointerEvents: 'none' }}
    />
  );
};