interface BrandMarkProps {
  size?: number;
  className?: string;
}

/**
 * Bespoke "N" letterform — purely decorative.
 * No external icon library. Marked aria-hidden by the caller.
 */
export function BrandMark({ size = 28, className = '' }: BrandMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect
        x="0.5"
        y="0.5"
        width="27"
        height="27"
        stroke="currentColor"
        strokeOpacity="0.4"
      />
      <path
        d="M6 22 L6 6 L9 6 L19 18 L19 6 L22 6 L22 22 L19 22 L9 10 L9 22 Z"
        fill="currentColor"
      />
    </svg>
  );
}
