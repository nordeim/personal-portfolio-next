'use client';

import type { ParsedPortfolioItem } from '@/lib/types';
import { BentoTile, type CategoryTexture } from './BentoTile';

interface BentoGridProps {
  projects: ParsedPortfolioItem[];
  onOpen: (slug: string) => void;
}

function getTexture(category: string): CategoryTexture {
  const c = category.toLowerCase();
  if (c.includes('code') || c.includes('experiment') || c.includes('lab')) return 'mono';
  if (c.includes('poetry') || c.includes('story') || c.includes('essay')) return 'serif';
  if (c.includes('art') || c.includes('photo')) return 'image';
  return 'sans';
}

function getSpan(index: number, total: number): 'wide' | 'tall' | 'square' | 'auto' {
  if (index === 0) return 'wide';
  if (index === total - 1) return 'wide';
  if (index % 4 === 1) return 'tall';
  return 'square';
}

export function BentoGrid({ projects, onOpen }: BentoGridProps) {
  if (projects.length === 0) {
    return (
      <div className="border border-[var(--border-color)] p-12 text-center">
        <p className="font-editorial text-2xl mb-2">The shelf is empty.</p>
        <p className="font-utility text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
          No portfolio items found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 auto-rows-[minmax(280px,auto)] gap-0 border-l border-t border-[var(--border-color)]">
      {projects.map((project, i) => (
        <BentoTile
          key={`tile-${project.slug}`}
          project={project}
          texture={getTexture(project.category)}
          span={getSpan(i, projects.length)}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}
