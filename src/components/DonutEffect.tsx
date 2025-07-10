import React, { useEffect, useRef } from 'react';

interface DonutEffectProps {
  onComplete: () => void;
}

export const DonutEffect: React.FC<DonutEffectProps> = ({ onComplete }) => {
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

    let animationId: number;
    let A = 0, B = 0;
    const startTime = Date.now();
    const duration = 10000; // 10 seconds

    const draw = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Clear canvas
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Make donut smaller to ensure it fits
      const donutWidth = 40;
      const donutHeight = 40;
      const output: string[] = new Array(donutHeight).fill('').map(() => ' '.repeat(donutWidth));
      const zbuffer: number[] = new Array(donutWidth * donutHeight).fill(0);

      // Donut parameters
      const R1 = 1;
      const R2 = 2;
      const K2 = 5;
      const K1 = donutWidth * K2 * 3 / (8 * (R1 + R2));

      for (let theta = 0; theta < 6.28; theta += 0.07) {
        for (let phi = 0; phi < 6.28; phi += 0.02) {
          const costheta = Math.cos(theta);
          const sintheta = Math.sin(theta);
          const cosphi = Math.cos(phi);
          const sinphi = Math.sin(phi);

          const circlex = R2 + R1 * costheta;
          const circley = R1 * sintheta;

          const x = circlex * (Math.cos(B) * cosphi + Math.sin(A) * Math.sin(B) * sinphi) - circley * Math.cos(A) * Math.sin(B);
          const y = circlex * (Math.sin(B) * cosphi - Math.sin(A) * Math.cos(B) * sinphi) + circley * Math.cos(A) * Math.cos(B);
          const z = K2 + Math.cos(A) * circlex * sinphi + circley * Math.sin(A);
          const ooz = 1 / z;

          const xp = Math.floor(donutWidth / 2 + K1 * ooz * x);
          const yp = Math.floor(donutHeight / 2 - K1 * ooz * y);

          if (xp >= 0 && xp < donutWidth && yp >= 0 && yp < donutHeight) {
            const idx = xp + yp * donutWidth;
            if (ooz > zbuffer[idx]) {
              zbuffer[idx] = ooz;
              const L = cosphi * costheta * Math.sin(B) - Math.cos(A) * costheta * sinphi - Math.sin(A) * sintheta + Math.cos(B) * (Math.cos(A) * sintheta - costheta * Math.sin(A) * sinphi);
              const luminance_index = Math.floor(L * 8);
              const chars = '.,-~:;=!*#$@';
              const char = luminance_index > 0 ? chars[Math.min(luminance_index, chars.length - 1)] : ' ';
              
              if (yp < output.length && xp < output[yp].length) {
                output[yp] = output[yp].substring(0, xp) + char + output[yp].substring(xp + 1);
              }
            }
          }
        }
      }

      // Draw the donut
      ctx.fillStyle = '#0f4';
      ctx.font = '6px "Courier New", monospace';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Position at top left with small margin
      const startX = 20;
      const startY = 20;

      for (let i = 0; i < output.length; i++) {
        ctx.fillText(output[i], startX, startY + i * 6);
      }

      // Update rotation
      A += 0.04;
      B += 0.02;

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