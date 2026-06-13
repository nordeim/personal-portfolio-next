'use client';

import { BrandMark } from './BrandMark';
import { ThemeToggle } from './ThemeToggle';

interface NavigationProps {
  isNight: boolean;
  isMenuOpen: boolean;
  onMenuToggle: () => void;
  onThemeToggle: () => void;
  onMXOpen: () => void;
  onNavigate: (href: string) => void;
}

const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Archive', href: '#archive' },
  { label: 'Contact', href: '#contact' },
];

export function Navigation({
  isNight,
  isMenuOpen,
  onMenuToggle,
  onThemeToggle,
  onMXOpen,
  onNavigate,
}: NavigationProps) {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-nav bg-[var(--bg-primary)] border-b border-[var(--border-color)]"
      role="banner"
    >
      <div className="flex items-center justify-between px-4 sm:px-7 py-4">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onNavigate('#top');
          }}
          className="flex items-center gap-3 text-[var(--text-primary)] hover:text-[var(--color-accent-code)] transition-colors"
          aria-label="Nicholas Yun — Home"
        >
          <BrandMark size={24} />
          <span className="font-utility text-[0.7rem] uppercase tracking-[0.18em]">
            Nicholas Yun
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="hidden md:flex items-center gap-1"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(link.href);
              }}
              className="font-utility text-[0.7rem] uppercase tracking-[0.18em] px-3 py-2 border border-transparent hover:border-[var(--border-strong)] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={onMXOpen}
            className="font-utility text-[0.7rem] uppercase tracking-[0.18em] px-3 py-2 border border-[var(--color-accent-code)] text-[var(--color-accent-code)] hover:bg-[var(--color-accent-code)] hover:text-white transition-colors"
            aria-label="Open machine mode"
          >
            ◉ MX
          </button>
          <ThemeToggle isNight={isNight} onToggle={onThemeToggle} />
        </nav>

        {/* Mobile menu trigger */}
        <button
          type="button"
          onClick={onMenuToggle}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-drawer"
          className="md:hidden font-utility text-[0.7rem] uppercase tracking-[0.18em] px-3 py-2 border border-[var(--border-strong)]"
        >
          {isMenuOpen ? 'Close' : 'Menu'}
        </button>
      </div>
    </header>
  );
}
