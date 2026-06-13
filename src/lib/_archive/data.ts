import type { NavLink, SocialLink, SiteConfig, Project } from "./types";

export const siteConfig: SiteConfig = {
  name: "Nicholas Yun",
  title: "Software Engineer & Designer",
  email: "hello@nicholasyun.com",
  github: "nordeim",
  githubUrl: "https://github.com/nordeim",
  linkedin: "nicholasyun",
  linkedinUrl: "https://linkedin.com/in/nicholasyun",
  location: "New York, NY",
};

export const navLinks: NavLink[] = [
  { label: "Who", href: "#who" },
  { label: "Work", href: "#work" },
  { label: "Skills", href: "#skills" },
  { label: "Music", href: "#music" },
  { label: "Now", href: "#now" },
  { label: "Contact", href: "#contact" },
];

export const socialLinks: SocialLink[] = [
  { platform: "GitHub", url: "https://github.com/nordeim" },
  { platform: "LinkedIn", url: "https://linkedin.com/in/nicholasyun" },
];

export const portraitMap: Record<string, string> = {
  hero: "/portraits/hero.webp",
  who: "/portraits/who.webp",
};

export const projects: Project[] = [
  {
    id: "civitas",
    title: "Civitas",
    description:
      "A community platform designed to foster meaningful connections and civic engagement. Built with performance and accessibility at its core.",
    role: "Lead Developer",
    period: "2024",
    category: "full-stack",
    tech: ["Next.js", "TypeScript", "PostgreSQL"],
    links: { live: "#", repo: "#" },
    featured: true,
  },
  {
    id: "lattice",
    title: "Lattice",
    description:
      "A generative design system that explores the intersection of mathematics and visual aesthetics through interactive visualizations.",
    role: "Creative Technologist",
    period: "2023",
    category: "frontend",
    tech: ["Three.js", "GLSL", "TypeScript"],
    links: { live: "#", repo: "#" },
    featured: true,
  },
  {
    id: "thesis",
    title: "Thesis",
    description:
      "My academic research project exploring algorithmic approaches to sustainable urban planning and resource allocation.",
    role: "Researcher",
    period: "2023",
    category: "research",
    tech: ["Python", "TensorFlow", "GIS"],
    links: {},
  },
  {
    id: "forge",
    title: "Forge",
    description:
      "A lightweight development toolkit that streamlines the creation of accessible, performant web applications with built-in design system tooling.",
    role: "Creator",
    period: "2024",
    category: "tool",
    tech: ["Node.js", "TypeScript", "CLI"],
    links: { repo: "#" },
  },
  {
    id: "pulse",
    title: "Pulse",
    description:
      "A real-time data visualization dashboard that transforms complex datasets into intuitive, interactive narratives for decision-makers.",
    role: "Frontend Lead",
    period: "2023",
    category: "frontend",
    tech: ["React", "D3.js", "WebSocket"],
    links: { live: "#" },
  },
];
