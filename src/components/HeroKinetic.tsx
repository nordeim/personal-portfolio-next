'use client';

import { useEffect, useRef } from 'react';
import type { HeroSlide } from '@/lib/types';
import { useWeightedScroll } from '@/hooks/useWeightedScroll';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { getPortraitForKey } from '@/lib/data';

interface HeroKineticProps {
  slide: HeroSlide;
  onPrev: () => void;
  onNext: () => void;
  onDotClick: (index: number) => void;
  activeIndex: number;
  totalSlides: number;
}

const AUTO_ROTATE_MS = 10000;

export function HeroKinetic({
  slide,
  onPrev,
  onNext,
  onDotClick,
  activeIndex,
  totalSlides,
}: HeroKineticProps) {
  const fontWeight = useWeightedScroll();
  const prefersReduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const autoRotateRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Pointer parallax via CSS vars
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReduced) return;

    const handleMove = (e: PointerEvent): void => {
      const rect = section.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      section.style.setProperty('--slide-x', String(x));
      section.style.setProperty('--slide-y', String(y));
    };

    section.addEventListener('pointermove', handleMove);
    return () => section.removeEventListener('pointermove', handleMove);
  }, [prefersReduced]);

  // Auto-rotation
  useEffect(() => {
    if (prefersReduced) return;
    autoRotateRef.current = setInterval(() => {
      onNext();
    }, AUTO_ROTATE_MS);
    return () => {
      if (autoRotateRef.current !== null) {
        clearInterval(autoRotateRef.current);
        autoRotateRef.current = null;
      }
    };
  }, [onNext, prefersReduced, activeIndex]);

  const headlineWeight = prefersReduced ? 950 : fontWeight;

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-[100vh] px-4 sm:px-7 py-12 sm:py-20 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-14"
      style={
        {
          '--slide-accent': slide.accent,
          '--slide-secondary': slide.secondaryAccent,
        } as React.CSSProperties
      }
    >
      {/* Left: editorial */}
      <div className="z-hero flex flex-col justify-between gap-10 order-2 lg:order-1">
        <div>
          <p className="font-utility text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-muted)] mb-6 flex items-center gap-3">
            <span
              className="inline-block w-3 h-px"
              style={{ background: slide.accent }}
              aria-hidden="true"
            />
            {slide.label}
          </p>

          <h1
            className="font-editorial leading-[0.95] tracking-[-0.02em] text-[clamp(2.6rem,9vw,8.5rem)] mb-6"
            style={{ fontWeight: headlineWeight }}
          >
            {slide.headline}
          </h1>

          <p className="font-body text-[clamp(1rem,1.4vw,1.4rem)] text-[var(--text-secondary)] max-w-[36ch]">
            {slide.subtitle}
          </p>
        </div>

        <div className="border-t border-[var(--border-color)] pt-6 flex flex-col gap-2">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            Now
          </p>
          <p className="font-editorial text-2xl">{slide.artifactTitle}</p>
          <p className="font-utility text-xs text-[var(--text-secondary)]">
            {slide.artifactMeta}
          </p>
        </div>
      </div>

      {/* Right: portrait frame */}
      <div className="z-hero relative aspect-[3/4] order-1 lg:order-2">
        <div
          className="absolute inset-0 border border-[var(--border-strong)]"
          style={{
            transform: prefersReduced
              ? 'none'
              : 'translate3d(calc(var(--slide-x, 0) * 14px), calc(var(--slide-y, 0) * 14px), 0)',
            transition: 'transform 400ms ease-out',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 border border-[var(--border-color)]"
          style={{
            transform: prefersReduced
              ? 'none'
              : 'translate3d(calc(var(--slide-x, 0) * 24px), calc(var(--slide-y, 0) * 24px), 0)',
            transition: 'transform 500ms ease-out',
          }}
          aria-hidden="true"
        />
        <figure className="relative h-full w-full border border-[var(--border-strong)] overflow-hidden bg-[var(--bg-elevated)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            key={slide.portraitKey}
            src={getPortraitForKey(slide.portraitKey)}
            alt={`Portrait — ${slide.label}`}
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              transform: prefersReduced
                ? 'none'
                : 'translate3d(calc(var(--slide-x, 0) * 36px), calc(var(--slide-y, 0) * 36px), 0) scale(1.05)',
              transition: 'transform 600ms ease-out',
            }}
          />
          <figcaption className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-gradient-to-t from-black/60 to-transparent">
            <p className="font-editorial text-2xl text-white">{slide.signature}</p>
          </figcaption>
        </figure>
      </div>

      {/* Controls — prev/next */}
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous slide"
        className="z-hero-controls absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-[var(--border-strong)] hover:border-[var(--color-accent-code)] hover:text-[var(--color-accent-code)] transition-colors font-utility"
      >
        ←
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next slide"
        className="z-hero-controls absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center border border-[var(--border-strong)] hover:border-[var(--color-accent-code)] hover:text-[var(--color-accent-code)] transition-colors font-utility"
      >
        →
      </button>

      {/* Dots */}
      <div
        role="tablist"
        aria-label="Slide navigation"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-hero-controls flex items-center gap-3"
      >
        {Array.from({ length: totalSlides }).map((_, i) => (
          <button
            key={`dot-${i}`}
            type="button"
            role="tab"
            aria-selected={activeIndex === i}
            aria-pressed={activeIndex === i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => onDotClick(i)}
            className="w-8 h-1 border border-[var(--border-strong)] transition-colors"
            style={{
              background: activeIndex === i ? 'var(--slide-accent)' : 'transparent',
            }}
          />
        ))}
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 right-4 sm:right-7 z-hero-controls hidden sm:flex items-center gap-2 font-utility text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
        <span>Scroll</span>
        <span className="inline-block w-6 h-px bg-current" aria-hidden="true" />
      </div>
    </section>
  );
}
