/**
 * Site Configuration — Single source of truth
 *
 * All site-wide constants (name, email, social links, etc.)
 * should be imported from here to prevent drift.
 */

export const siteConfig = {
  name: "Nicholas Yun",
  title: "Nicholas Yun — Software Engineer & Designer",
  email: "hello@nicholasyun.com",
  github: "nordeim",
  githubUrl: "https://github.com/nordeim",
  linkedin: "nicholasyun",
  linkedinUrl: "https://linkedin.com/in/nicholasyun",
  location: "New York",
  url: "https://nicholasyun.com",
} as const;

/**
 * Get all social links as an iterable array.
 * Useful for footer/navbar rendering.
 */
export function getSocialLinks(): ReadonlyArray<{
  readonly name: string;
  readonly url: string;
}> {
  return [
    { name: "GitHub", url: siteConfig.githubUrl },
    { name: "LinkedIn", url: siteConfig.linkedinUrl },
    { name: "Email", url: `mailto:${siteConfig.email}` },
  ];
}
