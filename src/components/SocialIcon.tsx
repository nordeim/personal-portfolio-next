import type { ReactElement } from 'react';
import type { SocialIconVariant } from '@/lib/types';

interface SocialIconProps {
  variant: SocialIconVariant;
  size?: number;
  className?: string;
}

const ICON_PATHS: Record<SocialIconVariant, ReactElement> = {
  mail: (
    <>
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path d="M2 5 L12 13 L22 5" stroke="currentColor" strokeWidth="1.2" fill="none" />
    </>
  ),
  linkedin: (
    <>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <path
        d="M7 10 L7 18 M7 7 L7 7.01 M11 18 L11 13 C11 11.5 12 10.5 13.5 10.5 C15 10.5 16 11.5 16 13 L16 18 M16 13 L16 18"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
    </>
  ),
  instagram: (
    <>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.2" fill="none" />
      <circle cx="17" cy="7" r="0.6" fill="currentColor" />
    </>
  ),
  github: (
    <>
      <path
        d="M12 2 C6.5 2 2 6.5 2 12 C2 16.4 4.9 20.1 8.8 21.3 C9.3 21.4 9.5 21.1 9.5 20.8 L9.5 19 C7 19.5 6.5 17.8 6.5 17.8 C6.1 16.9 5.5 16.6 5.5 16.6 C4.6 16 5.5 16 5.5 16 C6.5 16.1 7 17 7 17 C7.9 18.4 9.4 18 10 17.7 C10.1 17.1 10.4 16.6 10.7 16.4 C8.7 16.2 6.6 15.4 6.6 11.7 C6.6 10.7 7 9.9 7.6 9.3 C7.5 9.1 7.2 8.2 7.7 7 C7.7 7 8.5 6.8 10 7.8 C10.7 7.6 11.4 7.5 12.1 7.5 C12.8 7.5 13.5 7.6 14.2 7.8 C15.7 6.8 16.5 7 16.5 7 C17 8.2 16.7 9.1 16.6 9.3 C17.2 9.9 17.6 10.7 17.6 11.7 C17.6 15.4 15.5 16.2 13.5 16.4 C13.9 16.7 14.2 17.4 14.2 18.3 L14.2 20.8 C14.2 21.1 14.4 21.4 14.9 21.3 C18.8 20.1 22 16.4 22 12 C22 6.5 17.5 2 12 2 Z"
        fill="currentColor"
      />
    </>
  ),
};

export function SocialIcon({ variant, size = 18, className = '' }: SocialIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {ICON_PATHS[variant]}
    </svg>
  );
}
