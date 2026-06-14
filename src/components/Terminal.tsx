"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { siteConfig } from "@/lib/site-config";

interface TerminalLine {
  readonly id: number;
  readonly type: "input" | "output" | "error";
  readonly text: string;
}

let _id = 0;
function newLine(type: TerminalLine["type"], text: string): TerminalLine {
  return { id: ++_id, type, text };
}

const WELCOME_LINES: readonly TerminalLine[] = [
  newLine("output", "Welcome to The Engineered Soul Terminal"),
  newLine("output", 'Type "help" for available commands.'),
  newLine("output", ""),
] as const;

const COMMANDS: Record<string, () => string> = {
  help: () =>
    [
      "Available commands:",
      "  about     — About Nicholas Yun",
      "  projects  — View projects",
      "  skills    — List skills",
      "  contact   — Contact info",
      "  clear     — Clear terminal",
      "  help      — Show this message",
    ].join("\n"),
  about: () =>
    `${siteConfig.name} — Full-Stack Developer, Designer, and Engineer. Crafting digital experiences with precision and intention.`,
  projects: () =>
    "Navigate to #projects to view the project gallery, or use the Projects section above.",
  skills: () =>
    "TypeScript · React · Next.js · Node.js · PostgreSQL · Tailwind CSS · Design Systems",
  contact: () => `Email: ${siteConfig.email} · GitHub: github.com/${siteConfig.github}`,
  clear: () => "__CLEAR__",
};

export default function Terminal() {
  const [lines, setLines] = useState<readonly TerminalLine[]>(WELCOME_LINES);
  const [inputValue, setInputValue] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<readonly string[]>([]);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const executeCommand = useCallback(
    (raw: string) => {
      const trimmed = raw.trim().toLowerCase();

      if (!trimmed) {
        setLines((prev) => [...prev, newLine("input", `$ ${raw}`)]);
        return;
      }

      setCommandHistory((prev) => [...prev, trimmed]);
      setHistoryIndex(-1);

      if (trimmed === "clear") {
        setLines([]);
        setInputValue("");
        return;
      }

      const handler = COMMANDS[trimmed];

      if (handler) {
        const output = handler();
        setLines((prev) => [
          ...prev,
          newLine("input", `$ ${raw}`),
          newLine("output", output),
          newLine("output", ""),
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          newLine("input", `$ ${raw}`),
          newLine(
            "error",
            `Command not found: ${trimmed}. Type "help" for available commands.`,
          ),
          newLine("output", ""),
        ]);
      }

      setInputValue("");
    },
    [],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        executeCommand(inputValue);
        return;
      }

      // Command history navigation
      if (e.key === "ArrowUp") {
        e.preventDefault();
        if (commandHistory.length === 0) return;

        const newIndex =
          historyIndex === -1
            ? commandHistory.length - 1
            : Math.max(0, historyIndex - 1);

        setHistoryIndex(newIndex);
        setInputValue(commandHistory[newIndex] ?? "");
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        if (historyIndex === -1) return;

        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInputValue("");
        } else {
          setHistoryIndex(newIndex);
          setInputValue(commandHistory[newIndex] ?? "");
        }
      }
    },
    [inputValue, historyIndex, commandHistory, executeCommand],
  );

  const containerStyle = {
    background: "var(--color-bg-sunken)",
    border: "2px solid var(--color-border)",
    boxShadow: "var(--shadow-brutal)",
    fontFamily: "var(--font-mono)",
    fontSize: "0.8125rem",
    lineHeight: 1.65,
    maxWidth: "700px",
    overflow: "hidden",
  };

  const headerStyle = {
    display: "flex",
    alignItems: "center",
    gap: "var(--spacing-quarter)",
    padding: "var(--spacing-half) var(--spacing-grid)",
    borderBottom: "2px solid var(--color-border)",
    background: "var(--color-bg-elevated)",
  };

  const dotStyle = {
    width: "10px",
    height: "10px",
    border: "1.5px solid var(--color-border)",
    borderRadius: 0,
  };

  return (
    <div
      style={containerStyle}
      role="region"
      aria-label="Interactive terminal"
    >
      {/* Terminal header */}
      <div style={headerStyle}>
        <div aria-hidden="true" style={dotStyle} />
        <div aria-hidden="true" style={dotStyle} />
        <div aria-hidden="true" style={dotStyle} />
        <span
          style={{
            marginLeft: "auto",
            fontSize: "0.6875rem",
            color: "var(--color-text-muted)",
            letterSpacing: "0.1em",
            textTransform: "uppercase" as const,
          }}
        >
          terminal
        </span>
      </div>

      {/* Output area */}
      <div
        ref={outputRef}
        role="log"
        aria-live="polite"
        aria-label="Terminal output"
        style={{
          padding: "var(--spacing-grid)",
          maxHeight: "300px",
          overflowY: "auto",
          color: "var(--color-text-secondary)",
        }}
      >
        {lines.map((line) => (
          <div
            key={line.id}
            style={{
              color:
                line.type === "error"
                  ? "var(--color-error, #c0392b)"
                  : line.type === "input"
                    ? "var(--color-accent)"
                    : "var(--color-text-secondary)",
              whiteSpace: "pre-wrap",
            }}
          >
            {line.text}
          </div>
        ))}

        {/* Input line */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-quarter)" }}>
          <span aria-hidden="true" style={{ color: "var(--color-accent)" }}>
            $
          </span>
          <label htmlFor="terminal-input" className="sr-only">
            Terminal command input
          </label>
          <input
            ref={inputRef}
            id="terminal-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            aria-label="Terminal command input"
            autoComplete="off"
            spellCheck="false"
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              color: "var(--color-text-primary)",
              caretColor: "var(--color-accent)",
            }}
          />
        </div>
      </div>
    </div>
  );
}