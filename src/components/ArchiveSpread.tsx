'use client';

import type { Collection, ParsedCollectionItem } from '@/lib/types';
import { ArchiveItemCard } from './ArchiveItemCard';
import { ContentBody } from './ContentBody';

interface ArchiveSpreadProps {
  collection: Collection;
  items: ParsedCollectionItem[];
  activeItem: ParsedCollectionItem | null;
  onItemOpen: (slug: string) => void;
  onBack: () => void;
}

export function ArchiveSpread({
  collection,
  items,
  activeItem,
  onItemOpen,
  onBack,
}: ArchiveSpreadProps) {
  // --- Detail view ---
  if (activeItem) {
    return (
      <article className="px-4 sm:px-7 py-12 sm:py-20">
        <div className="max-w-[1400px] mx-auto">
          <button
            type="button"
            onClick={onBack}
            className="font-utility text-[0.7rem] uppercase tracking-[0.18em] mb-8 inline-flex items-center gap-2 border-b pb-1 hover:gap-3 transition-all"
            style={{ color: collection.accent, borderColor: collection.accent }}
          >
            ← Back to {collection.title}
          </button>

          <header className="mb-10">
            <p
              className="font-utility text-[0.7rem] uppercase tracking-[0.22em] mb-3"
              style={{ color: collection.accent }}
            >
              {collection.title} / {activeItem.category || 'Archive'}
            </p>
            <h1 className="font-editorial text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] mb-3">
              {activeItem.title}
            </h1>
            {activeItem.medium ? (
              <p className="font-utility text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
                {activeItem.medium} · {activeItem.status}
              </p>
            ) : null}
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-14">
            {/* Image */}
            <div>
              {activeItem.image ? (
                <div className="border border-[var(--border-color)] overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={activeItem.image}
                    alt={activeItem.title}
                    className="w-full h-auto"
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="aspect-[4/3] border border-[var(--border-color)] flex items-center justify-center bg-[var(--bg-elevated)]">
                  <span className="font-editorial text-9xl opacity-15" aria-hidden="true">
                    NY
                  </span>
                </div>
              )}
            </div>

            {/* Body */}
            <div>
              <p className="font-body text-lg leading-[1.6] text-[var(--text-secondary)] mb-8 italic">
                {activeItem.description}
              </p>

              {activeItem.body ? (
                <ContentBody body={activeItem.body} category={activeItem.category} />
              ) : null}

              {activeItem.document ? (
                <a
                  href={activeItem.document}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-8 font-utility text-[0.7rem] uppercase tracking-[0.18em] border-b pb-1"
                  style={{ color: collection.accent, borderColor: collection.accent }}
                >
                  Download document ↓
                </a>
              ) : null}

              {activeItem.link ? (
                <a
                  href={activeItem.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 ml-6 font-utility text-[0.7rem] uppercase tracking-[0.18em] border-b pb-1"
                  style={{ color: collection.accent, borderColor: collection.accent }}
                >
                  {activeItem.linkLabel} ↗
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </article>
    );
  }

  // --- Grid view ---
  return (
    <section
      id="archive"
      className="px-4 sm:px-7 py-12 sm:py-20 border-t border-[var(--border-color)]"
    >
      <div className="max-w-[1400px] mx-auto">
        <header className="mb-10">
          <p
            className="font-utility text-[0.7rem] uppercase tracking-[0.22em] mb-3 flex items-center gap-3"
            style={{ color: collection.accent }}
          >
            <span
              className="inline-block w-3 h-px"
              style={{ background: collection.accent }}
              aria-hidden="true"
            />
            Archive / {collection.title}
          </p>
          <h2 className="font-editorial text-[clamp(2rem,5vw,4rem)] leading-[1.05] mb-4">
            {collection.title}
          </h2>
          <p className="font-body text-lg text-[var(--text-secondary)] max-w-[60ch]">
            {collection.description}
          </p>
        </header>

        {items.length === 0 ? (
          <div className="border border-dashed border-[var(--border-color)] p-12 text-center">
            <p className="font-editorial text-2xl mb-2">No items in this collection yet.</p>
            <p className="font-utility text-xs uppercase tracking-[0.18em] text-[var(--text-muted)]">
              This collection is being curated.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-[var(--border-color)]">
            {items.map((item) => (
              <ArchiveItemCard
                key={`card-${item.slug}`}
                item={item}
                isActive={false}
                onOpen={onItemOpen}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
