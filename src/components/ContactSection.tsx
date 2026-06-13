import type { SocialLink } from '@/lib/types';
import { SocialIcon } from './SocialIcon';

interface ContactSectionProps {
  socialLinks: SocialLink[];
}

export function ContactSection({ socialLinks }: ContactSectionProps) {
  return (
    <section
      id="contact"
      className="px-4 sm:px-7 py-20 sm:py-28 border-t border-[var(--border-color)]"
    >
      <div className="max-w-[1400px] mx-auto">
        <p className="font-utility text-[0.7rem] uppercase tracking-[0.22em] text-[var(--text-muted)] mb-6 flex items-center gap-3">
          <span
            className="inline-block w-3 h-px"
            style={{ background: 'var(--color-accent-story)' }}
            aria-hidden="true"
          />
          Contact
        </p>

        <h2 className="font-editorial text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.02] max-w-[20ch] mb-12">
          If the work resonates, <em>write</em>.
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 border-t border-[var(--border-color)]">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group flex items-start gap-4 p-6 sm:p-8 border-b border-[var(--border-color)] hover:bg-[var(--bg-surface)] transition-colors"
            >
              <span
                className="text-[var(--text-primary)] group-hover:text-[var(--color-accent-code)] transition-colors"
              >
                <SocialIcon variant={link.icon} size={22} />
              </span>
              <div className="flex-1">
                <p className="font-utility text-[0.65rem] uppercase tracking-[0.22em] opacity-60 mb-1">
                  {link.label}
                </p>
                <p className="font-editorial text-2xl leading-[1.1] mb-1">
                  {link.description}
                </p>
              </div>
              <span
                className="font-utility text-[0.7rem] opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                aria-hidden="true"
              >
                ↗
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
