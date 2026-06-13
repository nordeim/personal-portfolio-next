"use client";

import { useCallback, useEffect, useState } from "react";

interface UseRouteHashReturn {
  readonly currentHash: string;
  readonly navigateTo: (hash: string) => void;
}

export function useRouteHash(): UseRouteHashReturn {
  const [currentHash, setCurrentHash] = useState<string>("");

  // Read initial hash on mount
  useEffect(() => {
    const hash = window.location.hash || "#hero";
    setCurrentHash(hash);

    // If there's a hash in the URL, scroll to it
    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Listen for hash changes (browser back/forward)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || "#hero";
      setCurrentHash(hash);

      // Move focus to the target section for accessibility
      const target = document.getElementById(hash.slice(1));
      if (target) {
        target.setAttribute("tabindex", "-1");
        target.focus({ preventScroll: true });
        target.addEventListener(
          "blur",
          () => target.removeAttribute("tabindex"),
          { once: true },
        );
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigateTo = useCallback((hash: string) => {
    window.location.hash = hash;

    const target = document.getElementById(hash.slice(1));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });

      // Move focus for screen readers
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
      target.addEventListener(
        "blur",
        () => target.removeAttribute("tabindex"),
        { once: true },
      );
    }
  }, []);

  return { currentHash, navigateTo } as const;
}