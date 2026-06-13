'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from './useReducedMotion';

const MIN_WEIGHT = 200;
const MAX_WEIGHT = 950;
const FRICTION = 0.85;
const VELOCITY_GAIN = 0.6;

/**
 * Maps vertical scroll velocity to a font-weight value (200-950).
 * - Fast scroll → thin weight (200)
 * - Slow scroll → heavy weight (950)
 * - Static     → heavy weight (950, friction settles)
 *
 * Respects `prefers-reduced-motion`: returns a static 950.
 */
export function useWeightedScroll(): number {
  const [fontWeight, setFontWeight] = useState(MAX_WEIGHT);
  const prefersReduced = useReducedMotion();
  const lastYRef = useRef(0);
  const lastTimeRef = useRef(0);
  const velocityRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isRunningRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (prefersReduced) {
      setFontWeight(MAX_WEIGHT);
      return;
    }

    const measureVelocity = (): void => {
      const currentY = window.scrollY;
      const currentTime = performance.now();

      if (lastTimeRef.current > 0) {
        const dt = currentTime - lastTimeRef.current;
        if (dt > 0) {
          const dy = Math.abs(currentY - lastYRef.current);
          const instantVelocity = dy / dt;
          velocityRef.current =
            velocityRef.current * FRICTION + instantVelocity * (1 - FRICTION);
        }
      }

      lastYRef.current = currentY;
      lastTimeRef.current = currentTime;
    };

    const tick = (): void => {
      measureVelocity();

      const v = Math.min(velocityRef.current, 3);
      const normalized = v / 3;
      const weight = Math.round(
        MAX_WEIGHT - normalized * VELOCITY_GAIN * (MAX_WEIGHT - MIN_WEIGHT)
      );

      setFontWeight(weight);
      rafRef.current = requestAnimationFrame(tick);
    };

    if (!isRunningRef.current) {
      isRunningRef.current = true;
      lastYRef.current = window.scrollY;
      lastTimeRef.current = performance.now();
      rafRef.current = requestAnimationFrame(tick);
    }

    return () => {
      isRunningRef.current = false;
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [prefersReduced]);

  return fontWeight;
}
