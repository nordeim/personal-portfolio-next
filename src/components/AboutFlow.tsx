'use client';

import { useEffect, useRef, useState } from 'react';
import type { AboutPillar } from '@/lib/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface AboutFlowProps {
  pillars: AboutPillar[];
}

export function AboutFlow({ pillars }: AboutFlowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'out' | 'in'>('idle');
  const [height, setHeight] = useState<number | 'auto'>('auto');
  const sizerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();
  const activePillar = pillars[activeIndex];

  // Stable-height swap: measure next pillar, then transition.
  const swapTo = (nextIndex: number): void => {
    if (nextIndex === activeIndex) return;
    if (prefersReduced) {
      setActiveIndex(nextIndex);
      return;
    }
    setPhase('out');
    setTimeout(() => {
      setActiveIndex(nextIndex);
      setPhase('in');
      setTimeout(() => setPhase('idle'), 900);
    }, 300);
  };

  // Re-measure sizer height when active pillar changes
  useEffect(() => {
    if (sizerRef.current) {
      const measured = sizerRef.current.scrollHeight;
      setHeight(measured);
    }
  }, [activePillar]);

  if (!activePillar) return null;

  const opacityClass =
    phase === 'out'
      ? 'opacity-0 translate-y-1'
      : phase === 'in'
        ? 'opacity-100 translate-y-0 animate-fade-in'
        : 'opacity-100 translate-y-0';

  return (
    <section
      id="about"
      className="relative px-4 sm:px-7 py-20 sm:py-28 border-t border-[var(--border-color)]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-[0.26fr_0.74fr] gap-8 lg:gap-14">
        {/* Left: pillar nav */}
        <div>
          <p className="font-utility text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-muted)] mb-6 flex items-center gap-3">
            <span
              className="inline-block w-3 h-px"
              style={{ background: 'var(--color-accent-poetry)' }}
              aria-hidden="true"
            />
            About
          </p>
          <h2 className="font-editorial text-[clamp(2rem,4vw,3.6rem)] leading-[1.05] mb-10">
            Four <em>quiet</em> convictions.
          </h2>

          <nav aria-label="About sections" className="flex flex-col gap-1">
            {pillars.map((pillar, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={`pillar-${i}`}
                  type="button"
                  onClick={() => swapTo(i)}
                  aria-pressed={isActive}
                  className={`text-left font-utility text-[0.7rem] uppercase tracking-[0.18em] py-3 px-4 border-l-2 transition-colors ${
                    isActive
                      ? 'border-[var(--color-accent-poetry)] bg-[var(--bg-surface)]'
                      : 'border-transparent hover:border-[var(--border-strong)]'
                  }`}
                >
                  <span className="block font-editorial text-lg normal-case tracking-normal mb-1">
                    {pillar.title}
                  </span>
                  <span className="block opacity-50">
                    {String(i + 1).padStart(2, '0')} / {String(pillars.length).padStart(2, '0')}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right: pillar body */}
        <div className="relative border-l border-[var(--border-color)] pl-6 sm:pl-10">
          {/* Hidden sizer — measures next pillar height */}
          <div
            ref={sizerRef}
            aria-hidden="true"
            className="invisible absolute inset-0 pointer-events-none"
          >
            <h3 className="font-editorial text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.1] mb-6">
              {activePillar.title}
            </h3>
            <div className="space-y-5 font-body text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.65] text-[var(--text-secondary)]">
              {activePillar.paragraphs.map((p, i) => (
                <p key={`sizer-para-${i}`}>{p}</p>
              ))}
            </div>
          </div>

          <div
            className={`transition-all duration-[900ms] ease-out ${opacityClass}`}
            style={{ minHeight: typeof height === 'number' ? `${height}px` : undefined }}
          >
            <h3 className="font-editorial text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.1] mb-6">
              {activePillar.title}
            </h3>
            <div className="space-y-5 font-body text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.65] text-[var(--text-secondary)]">
              {activePillar.paragraphs.map((p, i) => (
                <p key={`para-${i}`}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
