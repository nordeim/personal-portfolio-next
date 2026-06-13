interface ContentBodyProps {
  body: string;
  category?: string;
}

/**
 * Renders Markdown-flavored body text.
 * - Poetry: split by newlines, render each line as a stanza.
 * - Prose:  split by blank lines, render each paragraph.
 * Always uses stable, index-based React keys.
 */
export function ContentBody({ body, category }: ContentBodyProps) {
  const isPoetry =
    category?.toLowerCase().includes('poetry') ||
    category?.toLowerCase().includes('lyric') ||
    category?.toLowerCase().includes('poem');

  const normalized = body.replace(/\r\n/g, '\n').trim();
  if (!normalized) {
    return (
      <p className="font-utility text-sm text-[var(--text-muted)] italic">
        No body content.
      </p>
    );
  }

  if (isPoetry) {
    const lines = normalized.split('\n');
    return (
      <div className="font-editorial text-2xl leading-[1.5] text-[var(--text-primary)]">
        {lines.map((line, i) => (
          <p
            key={`poem-line-${i}`}
            className={line.trim() === '' ? 'h-6' : ''}
          >
            {line.trim() === '' ? '\u00A0' : line}
          </p>
        ))}
      </div>
    );
  }

  const paragraphs = normalized.split(/\n\s*\n/).filter((p) => p.trim() !== '');
  return (
    <div className="font-body text-[clamp(1rem,1.2vw,1.15rem)] leading-[1.65] text-[var(--text-secondary)] space-y-5">
      {paragraphs.map((p, i) => (
        <p key={`prose-para-${i}`}>{p.trim()}</p>
      ))}
    </div>
  );
}
