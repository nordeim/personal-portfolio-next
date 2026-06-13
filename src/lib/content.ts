export interface SiteContent {
  readonly title: string;
  readonly subtitle: string;
  readonly description: string;
}

export const siteContent: SiteContent = {
  title: "The Engineered Soul",
  subtitle: "Nicholas Yun",
  description:
    "Full-Stack Developer, Designer, and Engineer. Crafting digital experiences with precision and intention.",
} as const;