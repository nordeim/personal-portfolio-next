"use client";

import { useMemo, useState, useCallback } from "react";
import ProjectCard from "./ProjectCard";
import ScrollReveal from "./ScrollReveal";
import { projects } from "@/lib/projects";

const ALL_TAGS = [
  "All",
  ...Array.from(new Set(projects.flatMap((p) => [...p.tech]))),
] as const;

export default function ProjectsSection() {
  const [activeTag, setActiveTag] = useState<string>("All");

  const filteredProjects = useMemo(() => {
    if (activeTag === "All") return projects;
    return projects.filter((p) => [...p.tech].includes(activeTag));
  }, [activeTag]);

  const handleTagClick = useCallback((tag: string) => {
    setActiveTag(tag);
  }, []);

  return (
    <div>
      {/* Tag filter */}
      <div
        role="group"
        aria-label="Filter projects by technology"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "var(--spacing-half)",
          marginBottom: "var(--spacing-grid)",
        }}
      >
        {ALL_TAGS.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            aria-pressed={activeTag === tag}
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.75rem",
              letterSpacing: "0.05em",
              textTransform: "uppercase" as const,
              padding: "var(--spacing-quarter) var(--spacing-half)",
              border: "2px solid var(--color-border)",
              background:
                activeTag === tag
                  ? "var(--color-text-primary)"
                  : "transparent",
              color:
                activeTag === tag
                  ? "var(--color-text-inverse)"
                  : "var(--color-text-secondary)",
              cursor: "pointer",
              borderRadius: 0,
              transition: "background var(--transition-fast), color var(--transition-fast)",
            }}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {filteredProjects.length === 0 ? (
        <div
          role="status"
          style={{
            padding: "var(--spacing-double) var(--spacing-grid)",
            textAlign: "center" as const,
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            color: "var(--color-text-muted)",
            border: "2px dashed var(--color-border-subtle)",
          }}
        >
          No projects match the selected filter.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "var(--spacing-grid)",
          }}
        >
          {filteredProjects.map((project, index) => (
            <ScrollReveal key={project.id} delay={index * 0.08}>
              <ProjectCard project={project} />
            </ScrollReveal>
          ))}
        </div>
      )}
    </div>
  );
}