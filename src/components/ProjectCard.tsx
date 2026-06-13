"use client";

import { useMemo } from "react";
import type { Project } from "@/lib/projects";

interface ProjectCardProps {
  readonly project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const tags = useMemo(() => project.tags, [project.tags]);

  return (
    <article
      style={{
        border: "2px solid var(--color-border)",
        background: "var(--color-surface)",
        boxShadow: "var(--shadow-brutal-sm)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "transform var(--transition-fast), box-shadow var(--transition-fast)",
      }}
    >
      {/* Project image */}
      {project.image && (
        <div
          style={{
            width: "100%",
            height: "200px",
            borderBottom: "2px solid var(--color-border)",
            overflow: "hidden",
            background: "var(--color-bg-sunken)",
          }}
        >
          <img
            src={project.image}
            alt={`Screenshot of ${project.title}`}
            loading="lazy"
            width={400}
            height={200}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Content */}
      <div
        style={{
          padding: "var(--spacing-grid)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--spacing-half)",
          flex: 1,
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 600,
            color: "var(--color-text-primary)",
          }}
        >
          {project.title}
        </h3>

        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.875rem",
            lineHeight: 1.65,
            color: "var(--color-text-secondary)",
            flex: 1,
          }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "var(--spacing-quarter)",
            marginTop: "var(--spacing-half)",
          }}
        >
          {tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                padding: "2px var(--spacing-quarter)",
                border: "1px solid var(--color-border-subtle)",
                color: "var(--color-text-muted)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Links */}
        <div
          style={{
            display: "flex",
            gap: "var(--spacing-half)",
            marginTop: "var(--spacing-half)",
            paddingTop: "var(--spacing-half)",
            borderTop: "1px solid var(--color-border-subtle)",
          }}
        >
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} source code on GitHub (opens in new tab)`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                color: "var(--color-accent)",
              }}
            >
              Source →
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} live demo (opens in new tab)`}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.75rem",
                letterSpacing: "0.05em",
                textTransform: "uppercase" as const,
                textDecoration: "none",
                color: "var(--color-accent)",
              }}
            >
              Live →
            </a>
          )}
        </div>
      </div>
    </article>
  );
}