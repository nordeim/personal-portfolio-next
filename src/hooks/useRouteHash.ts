import { useState, useEffect, useCallback } from "react";

const VALID_SECTIONS = [
  "hero",
  "who",
  "work",
  "skills",
  "music",
  "now",
  "contact",
] as const;

type Section = (typeof VALID_SECTIONS)[number];

function getHashFromWindow(): string {
  if (typeof window === "undefined") return "hero";
  const hash = window.location.hash.replace("#", "");
  return VALID_SECTIONS.includes(hash as Section) ? hash : "hero";
}

export function useRouteHash(): [string, (section: string) => void] {
  const [activeSection, setActiveSectionState] = useState<string>(
    getHashFromWindow
  );

  const setActiveSection = useCallback((section: string) => {
    const valid = VALID_SECTIONS.includes(section as Section)
      ? section
      : "hero";
    window.location.hash = valid;
    setActiveSectionState(valid);
  }, []);

  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash.replace("#", "");
      const valid = VALID_SECTIONS.includes(hash as Section) ? hash : "hero";
      setActiveSectionState(valid);
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return [activeSection, setActiveSection];
}
