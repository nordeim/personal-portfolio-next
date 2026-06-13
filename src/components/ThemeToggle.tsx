'use client';

import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  isNight: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isNight, onToggle }: ThemeToggleProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="font-utility text-xs uppercase tracking-widest px-3 py-2 border border-current opacity-30"
      >
        ·
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isNight ? 'Switch to day theme' : 'Switch to night theme'}
      aria-pressed={!isNight}
      className="font-utility text-[0.7rem] uppercase tracking-[0.18em] px-3 py-2 border border-[var(--border-strong)] hover:border-[var(--color-accent-code)] transition-colors"
    >
      {isNight ? '☾ Night' : '☼ Day'}
    </button>
  );
}
