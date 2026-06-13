'use client';

import type { ParsedCollectionItem } from '@/lib/types';

interface ArchiveItemCardProps {
  item: ParsedCollectionItem;
  isActive: boolean;
  onOpen: (slug: string) => void;
}

export function ArchiveItemCard({ item, isActive, onOpen }: ArchiveItemCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen(item.slug)}
      aria-pressed={isActive}
      className={`group text-left w-full border bg-[var(--bg-surface)] transition-all ${
        isActive
          ? 'border-[var(--color-accent-code)]'
          : 'border-[var(--border-color)] hover:border-[var(--border-strong)]'
      }`}
    >
      {item.image ? (
        <div className="aspect-[4/3] border-b border-[var(--border-color)] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-[4/3] border-b border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-elevated)]">
          <span
            className="font-editorial text-7xl opacity-20"
            aria-hidden="true"
          >
            NY
          </span>
        </div>
      )}
      <div className="p-5">
        <p
          className="font-utility text-[0.65rem] uppercase tracking-[0.22em] mb-2"
          style={{ color: item.accent }}
        >
          {item.category || 'Archive'}
        </p>
        <h3 className="font-editorial text-2xl leading-[1.1] mb-2">{item.title}</h3>
        <p className="font-body text-sm text-[var(--text-secondary)] line-clamp-2">
          {item.description}
        </p>
        <p className="font-utility text-[0.65rem] uppercase tracking-[0.22em] text-[var(--text-muted)] mt-3">
          {item.status}
        </p>
      </div>
    </button>
  );
}
