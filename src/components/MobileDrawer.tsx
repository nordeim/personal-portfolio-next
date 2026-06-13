'use client';

import { useEffect, useRef } from 'react';
import type { SocialLink } from '@/lib/types';
import { SocialIcon } from './SocialIcon';
import { BrandMark } from './BrandMark';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
  navLinks: { label: string; href: string }[];
  socialLinks: SocialLink[];
  onMXOpen: () => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onNavigate,
  navLinks,
  socialLinks,
  onMXOpen,
}: MobileDrawerProps) {
  const drawerRef = useRef<HTMLElement>(null);

  // Body scroll lock with cleanup
  useEffect(() => {
    if (typeof document === 'undefined') return;
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const handleClick = (href: string) => {
    onNavigate(href);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-mobile-backdrop bg-[var(--bg-primary)] transition-opacity duration-300 ${
          isOpen ? 'opacity-90 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <aside
        ref={drawerRef}
        id="mobile-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!isOpen}
        className={`fixed top-0 right-0 h-full w-[min(420px,100vw)] bg-[var(--bg-surface)] border-l border-[var(--border-color)] z-mobile-drawer transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-[105%]'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-[var(--border-color)]">
          <BrandMark size={24} />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="font-utility text-xs uppercase tracking-widest px-3 py-2 border border-[var(--border-strong)] hover:border-[var(--color-accent-code)]"
          >
            Close ×
          </button>
        </div>

        <nav className="p-8 flex flex-col gap-1" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                handleClick(link.href);
              }}
              className="font-editorial text-3xl py-3 border-b border-[var(--border-color)] hover:pl-2 transition-all"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              onMXOpen();
              onClose();
            }}
            className="font-utility text-xs uppercase tracking-[0.18em] mt-6 py-3 px-4 border border-[var(--color-accent-code)] text-[var(--color-accent-code)] hover:bg-[var(--color-accent-code)] hover:text-white transition-colors text-left"
          >
            ◉ MX — Machine Mode
          </button>
        </nav>

        <div className="px-8 pt-8 border-t border-[var(--border-color)]">
          <p className="font-utility text-[0.7rem] uppercase tracking-[0.18em] opacity-50 mb-3">
            Reach
          </p>
          <div className="flex flex-col gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 py-2 font-utility text-xs uppercase tracking-widest hover:text-[var(--color-accent-code)]"
              >
                <SocialIcon variant={link.icon} size={16} />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
