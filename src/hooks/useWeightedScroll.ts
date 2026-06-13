import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "./useReducedMotion";

interface WeightedScrollOptions {
  weight?: number;
  duration?: number;
}

export function useWeightedScroll(
  containerRef: React.RefObject<HTMLElement | null>,
  options: WeightedScrollOptions = {}
) {
  const { weight = 0.1, duration = 1000 } = options;
  const prefersReducedMotion = useReducedMotion();
  const targetScrollTop = useRef(0);
  const currentScrollTop = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const isAnimating = useRef(false);

  const animate = useCallback(() => {
    if (prefersReducedMotion) return;

    const diff = targetScrollTop.current - currentScrollTop.current;

    if (Math.abs(diff) < 0.5) {
      currentScrollTop.current = targetScrollTop.current;
      if (containerRef.current) {
        containerRef.current.scrollTop = targetScrollTop.current;
      }
      isAnimating.current = false;
      return;
    }

    currentScrollTop.current += diff * weight;

    if (containerRef.current) {
      containerRef.current.scrollTop = currentScrollTop.current;
    }

    animationFrame.current = requestAnimationFrame(animate);
  }, [containerRef, weight, prefersReducedMotion]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion) return;

    function handleWheel(e: WheelEvent) {
      e.preventDefault();

      const maxScroll = container!.scrollHeight - container!.clientHeight;
      targetScrollTop.current = Math.max(
        0,
        Math.min(targetScrollTop.current + e.deltaY, maxScroll)
      );

      if (!isAnimating.current) {
        isAnimating.current = true;
        animationFrame.current = requestAnimationFrame(animate);
      }
    }

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (animationFrame.current !== null) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [containerRef, animate, prefersReducedMotion]);
}
