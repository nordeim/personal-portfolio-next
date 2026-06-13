export interface Project {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly tags: readonly string[];
  readonly image?: string;
  readonly github?: string;
  readonly live?: string;
  readonly featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "the-engineered-soul",
    title: "The Engineered Soul",
    description:
      "A brutally honest personal portfolio built with Next.js 16, React 19, and Tailwind CSS v4. Tactile Brutalism design system with zero border-radius and a 28px mathematical grid.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "https://github.com/nordeim/personal-portfolio-next",
    featured: true,
  },
  {
    id: "project-2",
    title: "Project Placeholder",
    description:
      "A demonstration project showcasing full-stack capabilities with modern tooling and clean architecture.",
    tags: ["React", "Node.js", "PostgreSQL"],
    featured: false,
  },
  {
    id: "project-3",
    title: "Design System",
    description:
      "A comprehensive design system with tokens, components, and documentation. Built for consistency and scalability.",
    tags: ["TypeScript", "Design Systems", "Tailwind CSS"],
    featured: false,
  },
];