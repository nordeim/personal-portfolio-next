'use client';

import type { ParsedPortfolioItem } from '@/lib/types';

export type CategoryTexture = 'mono' | 'serif' | 'sans' | 'image';

interface BentoTileProps {
  project: ParsedPortfolioItem;
  texture: CategoryTexture;
  span: 'wide' | 'tall' | 'square' | 'auto';
  onOpen: (slug: string) => void;
}

const SPAN_CLASS: Record<BentoTileProps['span'], string> = {
  wide: 'col-span-1 md:col-span-2 row-span-1',
  tall: 'col-span-1 md:col-span-1 row-span-1 md:row-span-2',
  square: 'col-span-1 row-span-1',
  auto: 'col-span-1 row-span-1',
};

export function BentoTile({ project, texture, span, onOpen }: BentoTileProps) {
  return (
    <article
      className={`group relative border border-[var(--border-color)] bg-[var(--bg-surface)] hover:border-[var(--border-strong)] transition-all ${SPAN_CLASS[span]}`}
      style={{ borderTopColor: project.accent, borderTopWidth: '4px' }}
    >
      <button
        type="button"
        onClick={() => onOpen(project.slug)}
        className="block w-full h-full text-left p-6 sm:p-8 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-[var(--color-accent-code)] focus-visible:outline-offset-[-3px]"
      >
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="font-utility text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-muted)]">
            {project.category}
          </p>
          <span
            className="font-utility text-[0.65rem] uppercase tracking-[0.22em] opacity-60"
            style={{ color: project.accent }}
          >
            {project.status}
          </span>
        </div>

        <h3
          className={`leading-[1.05] tracking-[-0.01em] mb-4 ${
            texture === 'serif'
              ? 'font-editorial text-[clamp(1.6rem,2.4vw,2.4rem)]'
              : texture === 'mono'
                ? 'font-utility text-[clamp(1.1rem,1.6vw,1.4rem)] uppercase tracking-tight'
                : 'font-editorial text-[clamp(1.4rem,2vw,2rem)]'
          }`}
        >
          {project.title}
        </h3>

        {project.image ? (
          <div className="aspect-[4/3] border border-[var(--border-color)] overflow-hidden mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ) : null}

        <p
          className={`mb-6 ${
            texture === 'mono'
              ? 'font-utility text-xs leading-[1.7] text-[var(--text-secondary)]'
              : 'font-body text-sm leading-[1.6] text-[var(--text-secondary)]'
          }`}
        >
          {project.description}
        </p>

        <span
          className="inline-flex items-center gap-2 font-utility text-[0.7rem] uppercase tracking-[0.18em] group-hover:gap-3 transition-all"
          style={{ color: project.accent }}
        >
          Open
          <span aria-hidden="true">→</span>
        </span>
      </button>
    </article>
  );
}
