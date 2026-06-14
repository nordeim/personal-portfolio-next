import type { TimelineEntry } from "./types";

export type { TimelineEntry } from "./types";

export const timeline: TimelineEntry[] = [
  {
    id: "current",
    role: "Full-Stack Developer",
    company: "Independent / Open Source",
    startDate: "2023",
    description:
      "Building tools and experiences with modern web technologies. Focused on performance, accessibility, and distinctive design.",
    tags: ["Next.js", "TypeScript", "React", "PostgreSQL"],
  },
  {
    id: "prev-1",
    role: "Frontend Engineer",
    company: "Previous Company",
    startDate: "2021",
    endDate: "2023",
    description:
      "Led frontend architecture initiatives, built design systems, and improved Core Web Vitals across the platform.",
    tags: ["React", "TypeScript", "Design Systems"],
  },
  {
    id: "prev-2",
    role: "Web Developer",
    company: "Earlier Role",
    startDate: "2019",
    endDate: "2021",
    description:
      "Developed responsive web applications and collaborated with design teams to create cohesive user experiences.",
    tags: ["JavaScript", "CSS", "HTML"],
  },
];
