export interface NavLink {
  label: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  email: string;
  github: string;
  githubUrl: string;
  linkedin: string;
  linkedinUrl: string;
  location: string;
  url: string;
}

export interface ProjectLink {
  live?: string;
  repo?: string;
}

export type ProjectCategory =
  | "full-stack"
  | "frontend"
  | "systems"
  | "research"
  | "tool"
  | "design"
  | "other";

export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  period: string;
  category: ProjectCategory;
  tech: readonly string[];
  links: ProjectLink;
  image?: string;
  featured?: boolean;
}

export interface AboutPillar {
  title: string;
  paragraphs: readonly string[];
}

export interface Skill {
  readonly name: string;
  readonly category: string;
  readonly level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export interface TimelineEntry {
  readonly id: string;
  readonly role: string;
  readonly company: string;
  readonly startDate: string;
  readonly endDate?: string;
  readonly description?: string;
  readonly tags?: readonly string[];
}

export interface ParsedCollectionItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  status: string;
  medium?: string;
  image?: string;
  body?: string;
  document?: string;
  link?: string;
  linkLabel?: string;
  accent: string;
}

export interface Collection {
  slug: string;
  title: string;
  description: string;
  accent: string;
}

export interface ParsedPortfolioItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  accent: string;
  status: string;
  image?: string;
  medium?: string;
  body?: string;
  link?: string;
  linkLabel?: string;
}

export interface MachineOverlayData {
  buildVersion: string;
  route: string;
  collections: Record<string, number>;
  activeData: unknown;
}

export type SocialIconVariant = "mail" | "linkedin" | "instagram" | "github";

// ============================================================================
// API Response Types
// ============================================================================

interface ContactApiSuccess {
  success: true;
  message: string;
}

interface ContactApiError {
  success: false;
  error: string;
  retryAfter?: number;
}

export type ContactApiResponse = ContactApiSuccess | ContactApiError;
