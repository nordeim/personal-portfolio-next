'use client';

import { useEffect } from 'react';
import type { MachineOverlayData } from '@/lib/types';

interface MachineOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  data: MachineOverlayData;
}

export function MachineOverlay({ isOpen, onClose, data }: MachineOverlayProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [isOpen, onClose]);

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-machine flex items-center justify-center p-4 sm:p-7"
      role="dialog"
      aria-modal="true"
      aria-label="Machine Mode — system state"
    >
      <div
        className="absolute inset-0 bg-black/85"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-[920px] max-h-[88vh] overflow-auto border border-[#00ff9d]/40 bg-[#0a0e0c] text-[#00ff9d] font-utility text-[0.78rem] leading-[1.7] p-6 sm:p-10">
        <header className="flex items-center justify-between mb-6 pb-4 border-b border-[#00ff9d]/20">
          <div className="flex items-center gap-3">
            <span className="inline-block w-2 h-2 bg-[#00ff9d] animate-pulse" aria-hidden="true" />
            <h2 className="font-utility uppercase tracking-[0.18em] text-[0.7rem]">
              ◉ Machine Mode — Live State
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close machine mode"
            className="font-utility uppercase tracking-[0.18em] text-[0.7rem] px-3 py-2 border border-[#00ff9d]/40 hover:bg-[#00ff9d] hover:text-[#0a0e0c] transition-colors"
          >
            Close ×
          </button>
        </header>

        <dl className="space-y-4">
          <Row label="build.version" value={data.buildVersion} />
          <Row label="route" value={data.route} />
          <Row
            label="collections"
            value={Object.entries(data.collections)
              .map(([slug, n]) => `${slug}=${n}`)
              .join('  ')}
          />
          <div>
            <dt className="text-[#00ff9d]/60 uppercase tracking-[0.18em] text-[0.65rem] mb-2">
              active.data
            </dt>
            <dd>
              <pre className="bg-black/40 border border-[#00ff9d]/20 p-4 overflow-auto text-[0.7rem]">
                {JSON.stringify(data.activeData, null, 2)}
              </pre>
            </dd>
          </div>
        </dl>

        <footer className="mt-6 pt-4 border-t border-[#00ff9d]/20 text-[#00ff9d]/60 text-[0.65rem] uppercase tracking-[0.18em]">
          Esc to close · This is the live system state
        </footer>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4">
      <dt className="text-[#00ff9d]/60 uppercase tracking-[0.18em] text-[0.65rem] sm:w-[140px] shrink-0">
        {label}
      </dt>
      <dd className="break-all">{value}</dd>
    </div>
  );
}
