export interface Skill {
  readonly name: string;
  readonly category: string;
  readonly level?: "beginner" | "intermediate" | "advanced" | "expert";
}

export const skills: Skill[] = [
  // Languages
  { name: "TypeScript", category: "Languages", level: "expert" },
  { name: "JavaScript", category: "Languages", level: "expert" },
  { name: "Python", category: "Languages", level: "advanced" },
  { name: "SQL", category: "Languages", level: "advanced" },
  { name: "HTML/CSS", category: "Languages", level: "expert" },

  // Frontend
  { name: "React", category: "Frontend", level: "expert" },
  { name: "Next.js", category: "Frontend", level: "expert" },
  { name: "Tailwind CSS", category: "Frontend", level: "expert" },
  { name: "Vue.js", category: "Frontend", level: "advanced" },
  { name: "Design Systems", category: "Frontend", level: "advanced" },

  // Backend
  { name: "Node.js", category: "Backend", level: "expert" },
  { name: "PostgreSQL", category: "Backend", level: "advanced" },
  { name: "Drizzle ORM", category: "Backend", level: "advanced" },
  { name: "REST APIs", category: "Backend", level: "expert" },
  { name: "GraphQL", category: "Backend", level: "intermediate" },

  // Tools & DevOps
  { name: "Git", category: "Tools", level: "expert" },
  { name: "Docker", category: "Tools", level: "advanced" },
  { name: "CI/CD", category: "Tools", level: "advanced" },
  { name: "Linux", category: "Tools", level: "advanced" },
  { name: "Figma", category: "Tools", level: "intermediate" },
];