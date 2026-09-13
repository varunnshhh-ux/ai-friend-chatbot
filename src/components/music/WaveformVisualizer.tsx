'use client';

import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  analyser?: AnalyserNode | null;
  colorTheme?: string;
  height?: number;
}

export default function WaveformVisualizer({
  isPlaying,
  analyser,
  colorTheme = '#8b5cf6',
  height = 56,
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (!isPlaying) {
        // Draw resting subtle line
        ctx.beginPath();
        ctx.moveTo(0, canvas.height / 2);
        ctx.lineTo(canvas.width, canvas.height / 2);
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 2;
        ctx.stroke();
        return;
      }

      phase += 0.08;
      const barCount = 32;
      const barWidth = canvas.width / barCount;

      for (let i = 0; i < barCount; i++) {
        // Procedural rhythmic animation
        const sinVal = Math.sin(phase + i * 0.35);
        const cosVal = Math.cos(phase * 1.5 + i * 0.2);
        const dynamicHeight = Math.max(6, Math.abs(sinVal * cosVal) * (canvas.height * 0.85));

        const x = i * barWidth + barWidth * 0.2;
        const y = (canvas.height - dynamicHeight) / 2;
        const w = barWidth * 0.6;

        // Gradient
        const grad = ctx.createLinearGradient(0, y, 0, y + dynamicHeight);
        grad.addColorStop(0, '#f43f5e');
        grad.addColorStop(0.5, colorTheme);
        grad.addColorStop(1, '#06b6d4');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.roundRect(x, y, w, dynamicHeight, 3);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isPlaying, analyser, colorTheme]);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-zinc-950/60 p-2 border border-white/5">
      <canvas
        ref={canvasRef}
        width={360}
        height={height}
        className="w-full h-full block"
      />
    </div>
  );
}
