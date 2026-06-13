"use client";

import { useCallback, useState, useEffect } from "react";

interface UseViewTransitionsReturn {
  readonly startTransition: (callback: () => void) => void;
  readonly isSupported: boolean;
}

export function useViewTransitions(): UseViewTransitionsReturn {
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    setIsSupported(typeof document !== "undefined" && "startViewTransition" in document);
  }, []);

  const startTransition = useCallback(
    (callback: () => void) => {
      if (!isSupported || typeof document === "undefined") {
        callback();
        return;
      }

      // Use the View Transitions API when available
      // The `startViewTransition` method may not be in TypeScript's lib yet
      const doc = document as Document & {
        startViewTransition?: (callback: () => void) => { finished: Promise<void> };
      };

      if (doc.startViewTransition) {
        doc.startViewTransition(callback);
      } else {
        callback();
      }
    },
    [isSupported],
  );

  return { startTransition, isSupported } as const;
}