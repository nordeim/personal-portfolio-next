import type { ReactNode } from 'react';

interface LayoutShellProps {
  children: ReactNode;
}

/**
 * Page-wide wrapper. Provides:
 * - 1px perimeter borders (the "framed installation" effect)
 * - Skip-to-content target ID
 * - Stable positioning for the visible 28px grid
 */
export function LayoutShell({ children }: LayoutShellProps) {
  return (
    <div className="relative min-h-screen pt-16">
      {/* Perimeter frame — top + bottom hairlines */}
      <div
        className="pointer-events-none fixed inset-x-0 top-16 h-px bg-[var(--border-color)] z-[5]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 h-px bg-[var(--border-color)] z-[5]"
        aria-hidden="true"
      />
      {/* Perimeter frame — left + right hairlines */}
      <div
        className="pointer-events-none fixed inset-y-0 left-0 w-px bg-[var(--border-color)] z-[5]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed inset-y-0 right-0 w-px bg-[var(--border-color)] z-[5]"
        aria-hidden="true"
      />

      <main id="main-content" tabIndex={-1} className="relative z-[1]">
        {children}
      </main>
    </div>
  );
}
