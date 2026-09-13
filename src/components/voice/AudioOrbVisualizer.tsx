'use client';

import React, { useRef, useEffect } from 'react';

interface AudioOrbVisualizerProps {
  isListening: boolean;
  isSpeaking: boolean;
  moodColor?: string;
}

export default function AudioOrbVisualizer({
  isListening,
  isSpeaking,
  moodColor = '#8b5cf6',
}: AudioOrbVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseRadius = 70;

      angle += 0.04;

      // Outer ambient glowing aura
      const grad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.5,
        centerX,
        centerY,
        baseRadius * 2.2
      );
      grad.addColorStop(0, moodColor);
      grad.addColorStop(0.5, isSpeaking ? 'rgba(244, 63, 94, 0.4)' : 'rgba(99, 102, 241, 0.3)');
      grad.addColorStop(1, 'transparent');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing wavy orb rings
      const numPoints = 64;
      const intensity = isSpeaking ? 16 : isListening ? 10 : 4;

      ctx.beginPath();
      for (let i = 0; i <= numPoints; i++) {
        const theta = (i / numPoints) * Math.PI * 2;
        const wave = Math.sin(theta * 6 + angle * 2) * Math.cos(theta * 4 - angle);
        const r = baseRadius + wave * intensity;
        const x = centerX + Math.cos(theta) * r;
        const y = centerY + Math.sin(theta) * r;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const innerGrad = ctx.createLinearGradient(
        centerX - baseRadius,
        centerY - baseRadius,
        centerX + baseRadius,
        centerY + baseRadius
      );
      innerGrad.addColorStop(0, '#6366f1');
      innerGrad.addColorStop(0.5, '#a855f7');
      innerGrad.addColorStop(1, '#ec4899');

      ctx.fillStyle = innerGrad;
      ctx.fill();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Core particle reflection
      ctx.beginPath();
      ctx.arc(centerX - 24, centerY - 24, 14, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.fill();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [isListening, isSpeaking, moodColor]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        width={340}
        height={340}
        className="w-72 h-72 sm:w-80 sm:h-80 block"
      />
    </div>
  );
}
