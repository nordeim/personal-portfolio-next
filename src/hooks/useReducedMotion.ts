'use client';

import { useEffect, useState } from 'react';

/**
 * Detects the user's `prefers-reduced-motion` setting.
 * Returns `true` when the user has requested reduced motion.
 *
 * SSR guard: returns `false` on the server.
 * Cleanup: removes the `change` listener on unmount.
 */
export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mql.matches);

    const handler = (event: MediaQueryListEvent): void => {
      setPrefersReduced(event.matches);
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  return prefersReduced;
}
