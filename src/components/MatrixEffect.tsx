import React, { useEffect, useRef } from 'react';

interface MatrixEffectProps {
  onComplete: () => void;
}

export const MatrixEffect: React.FC<MatrixEffectProps> = ({ onComplete }) => {
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

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;:,.<>?';
    const charArray = chars.split('');
    const fontSize = 12;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];

    // Initialize all drops to start at the top (synchronized)
    for (let i = 0; i < columns; i++) {
      drops[i] = 0;
    }

    let animationId: number;
    let startTime = Date.now();
    const duration = 5000; // 5 seconds
    const syncDuration = 1500; // First 1.5 seconds are synchronized

    const draw = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const syncProgress = Math.min(elapsed / syncDuration, 1);

      // Fade to black
      ctx.fillStyle = `rgba(0, 0, 0, ${0.05 + progress * 0.1})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw characters
      ctx.fillStyle = `rgba(0, 255, 68, ${1 - progress * 0.3})`;
      ctx.font = `${fontSize}px 'Courier New', monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        const x = i * fontSize + fontSize / 2;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // During sync phase, all drops fall together
        if (syncProgress < 1) {
          drops[i]++;
        } else {
          // After sync phase, transition to random behavior
          if (y > canvas.height && Math.random() > 0.975) {
            drops[i] = Math.floor(Math.random() * -50); // Random restart position
          } else {
            drops[i]++;
          }
        }
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