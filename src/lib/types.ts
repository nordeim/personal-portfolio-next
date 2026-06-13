/* ============================================================
   The Engineered Soul — Shared TypeScript Interfaces
   No `enum`, no `namespace` (strict TypeScript).
   ============================================================ */

export interface HeroSlide {
  label: string;
  portraitKey: string;
  headline: string;
  subtitle: string;
  artifactTitle: string;
  artifactMeta: string;
  signature: string;
  accent: string;
  secondaryAccent: string;
  tags: string[];
}

export interface AboutPillar {
  title: string;
  paragraphs: string[];
}

export interface Project {
  title: string;
  category: string;
  accent: string;
  medium?: string;
  status: string;
  description: string;
  link?: string;
  linkLabel: string;
  slug: string;
  image?: string;
  body?: string;
}

export interface CollectionItem extends Project {
  collectionSlug: string;
  document?: string;
}

export interface Collection {
  slug: string;
  title: string;
  category: string;
  accent: string;
  description: string;
  status: string;
}

export interface ArchiveRoute {
  collectionSlug: string;
  itemSlug: string | null;
}

export type SocialIconVariant = 'mail' | 'linkedin' | 'instagram' | 'github';

export interface SocialLink {
  label: string;
  icon: SocialIconVariant;
  href: string;
  description: string;
}

export interface MachineOverlayData {
  buildVersion: string;
  route: string;
  collections: Record<string, number>;
  activeData: unknown;
}

export interface ParsedCollectionItem {
  slug: string;
  collectionSlug: string;
  title: string;
  category: string;
  accent: string;
  status: string;
  description: string;
  link: string | null;
  linkLabel: string;
  body: string;
  image: string | null;
  document: string | null;
  medium: string | null;
}

export interface ParsedPortfolioItem {
  slug: string;
  title: string;
  category: string;
  accent: string;
  status: string;
  description: string;
  medium: string | null;
  link: string | null;
  linkLabel: string;
  body: string;
  image: string | null;
  collectionSlug: string;
}

export interface ParsedRoute {
  raw: string;
  section: string | null;
  collection: string | null;
  item: string | null;
  isArchive: boolean;
}
