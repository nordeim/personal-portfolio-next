"use client";

import { useEffect, useRef, useCallback } from "react";

interface CodeRainProps {
  readonly opacity?: number;
}

const CHARS = "01{}[]<>/;:=+-.#@$%&*!?".split("");
const FONT_SIZE = 14;
const COLUMN_GAP = 20;
const FRAME_INTERVAL = 50; // ms between frames (~20fps for performance)

export default function CodeRain({ opacity = 0.08 }: CodeRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const columnsRef = useRef<number[]>([]);

  const initColumns = useCallback((width: number, height: number) => {
    const columnCount = Math.floor(width / COLUMN_GAP);
    columnsRef.current = Array.from(
      { length: columnCount },
      () => Math.random() * (height / FONT_SIZE),
    );
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      // Graceful degradation — canvas not supported
      return;
    }

    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) {
      return;
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initColumns(canvas.width, canvas.height);
    };

    resize();

    let lastFrameTime = 0;

    const draw = (timestamp: number) => {
      if (timestamp - lastFrameTime < FRAME_INTERVAL) {
        animationRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = timestamp;

      // Semi-transparent overlay for trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#0f0";
      ctx.font = `${FONT_SIZE}px var(--font-mono, monospace)`;

      const columns = columnsRef.current;

      for (let i = 0; i < columns.length; i++) {
        const char = CHARS[Math.floor(Math.random() * CHARS.length)] ?? "0";
        const x = i * COLUMN_GAP;
        const colValue = columns[i] ?? 0;
        const y = colValue * FONT_SIZE;

        ctx.fillText(char, x, y);

        // Reset column when it reaches the bottom
        if (y > canvas.height && Math.random() > 0.975) {
          columns[i] = 0;
        }

        columns[i] = (columns[i] ?? 0) + 1;
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    animationRef.current = requestAnimationFrame(draw);

    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [initColumns]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity,
      }}
    />
  );
}