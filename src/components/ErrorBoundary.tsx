"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          role="alert"
          style={{
            padding: "var(--spacing-grid)",
            border: "2px solid var(--color-error, #c0392b)",
            background: "var(--color-bg-elevated, #ede8df)",
            fontFamily: "var(--font-mono)",
          }}
        >
          <p
            style={{
              fontWeight: 600,
              marginBottom: "var(--spacing-half)",
            }}
          >
            Something went wrong
          </p>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--color-text-muted)",
              marginBottom: "var(--spacing-half)",
            }}
          >
            {this.state.error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={this.handleRetry}
            style={{
              padding: "var(--spacing-quarter) var(--spacing-half)",
              border: "2px solid var(--color-border)",
              background: "transparent",
              fontFamily: "var(--font-mono)",
              fontSize: "0.8125rem",
              cursor: "pointer",
              borderRadius: 0,
            }}
          >
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}