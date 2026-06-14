import { useState, useEffect, useCallback } from "react";

const VALID_SECTIONS = [
  "hero",
  "about",
  "projects",
  "skills",
  "experience",
  "blog",
  "terminal",
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
    // Strip leading # if present (Navigation passes "#about" etc.)
    const clean = section.replace(/^#/, "");
    const valid = VALID_SECTIONS.includes(clean as Section)
      ? clean
      : "hero";
    // pushState avoids default browser scroll-to-anchor behaviour
    window.history.pushState(null, "", "#" + valid);
    setActiveSectionState(valid);

    // Move focus to the section heading for keyboard users
    requestAnimationFrame(() => {
      const sectionEl = document.getElementById(valid);
      if (sectionEl) {
        const heading = sectionEl.querySelector("h1, h2, h3");
        if (heading instanceof HTMLElement) {
          heading.setAttribute("tabindex", "-1");
          heading.focus({ preventScroll: true });
        }
      }
    });
  }, []);

  useEffect(() => {
    // popstate fires on back/forward navigation so we can sync the
    // active section when the URL hash changes via browser chrome.
    function handlePopState() {
      const hash = window.location.hash.replace("#", "");
      const valid = VALID_SECTIONS.includes(hash as Section) ? hash : "hero";
      setActiveSectionState(valid);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  return [activeSection, setActiveSection];
}
