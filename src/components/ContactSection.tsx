"use client";

import {
  FormEvent,
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
} from "react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

type SubmissionStatus = "idle" | "submitting" | "success" | "error";

const INITIAL_FORM: FormData = { name: "", email: "", message: "" };

function validateForm(data: FormData): FormErrors {
  const errors: FormErrors = {};

  if (!data.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!data.message.trim()) {
    errors.message = "Message is required.";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters.";
  }

  return errors;
}

export default function ContactSection() {
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [submitError, setSubmitError] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);

  const handleChange = useCallback(
    (field: keyof FormData) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        // Clear field error on change
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
      },
    [errors],
  );

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const validationErrors = validateForm(formData);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }

      setStatus("submitting");
      setSubmitError("");

      try {
        // Simulate form submission (replace with actual API endpoint)
        await new Promise((resolve) => setTimeout(resolve, 1500));

        setStatus("success");
        setFormData(INITIAL_FORM);
        setErrors({});
      } catch {
        setStatus("error");
        setSubmitError(
          "Something went wrong. Please try again or email me directly.",
        );
      }
    },
    [formData],
  );

  const handleReset = useCallback(() => {
    setStatus("idle");
    setSubmitError("");
  }, []);

  const inputStyle = {
    width: "100%",
    padding: "var(--spacing-half)",
    border: "2px solid var(--color-border)",
    background: "var(--color-surface)",
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    color: "var(--color-text-primary)",
    borderRadius: 0,
    outline: "none",
    transition: "border-color var(--transition-fast)",
  };

  const errorInputStyle = {
    ...inputStyle,
    borderColor: "var(--color-error, #c0392b)",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-secondary)",
    marginBottom: "var(--spacing-quarter)",
  };

  const errorTextStyle = {
    fontFamily: "var(--font-mono)",
    fontSize: "0.75rem",
    color: "var(--color-error, #c0392b)",
    marginTop: "4px",
  };

  // Success state
  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          textAlign: "center" as const,
          padding: "var(--spacing-double) var(--spacing-grid)",
        }}
      >
        <p
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "2rem",
            fontWeight: 600,
            marginBottom: "var(--spacing-half)",
          }}
        >
          Message Sent
        </p>
        <p
          style={{
            fontFamily: "var(--font-body)",
            color: "var(--color-text-secondary)",
            marginBottom: "var(--spacing-grid)",
          }}
        >
          Thank you for reaching out. I&apos;ll get back to you soon.
        </p>
        <button
          onClick={handleReset}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
            letterSpacing: "0.05em",
            textTransform: "uppercase" as const,
            padding: "var(--spacing-half) var(--spacing-grid)",
            border: "2px solid var(--color-border)",
            background: "transparent",
            cursor: "pointer",
            borderRadius: 0,
            color: "var(--color-text-primary)",
            transition: "background var(--transition-fast)",
          }}
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      noValidate
      aria-label="Contact form"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-grid)",
        maxWidth: "600px",
      }}
    >
      {/* Global error message */}
      {status === "error" && (
        <div
          role="alert"
          aria-live="assertive"
          style={{
            padding: "var(--spacing-half)",
            border: "2px solid var(--color-error, #c0392b)",
            background: "var(--color-accent-subtle)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.8125rem",
          }}
        >
          {submitError}
        </div>
      )}

      {/* Name field */}
      <div>
        <label htmlFor="contact-name" style={labelStyle}>
          Name *
        </label>
        <input
          id="contact-name"
          type="text"
          value={formData.name}
          onChange={handleChange("name")}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
          autoComplete="name"
          disabled={status === "submitting"}
          style={errors.name ? errorInputStyle : inputStyle}
        />
        {errors.name && (
          <p id="name-error" role="alert" style={errorTextStyle}>
            {errors.name}
          </p>
        )}
      </div>

      {/* Email field */}
      <div>
        <label htmlFor="contact-email" style={labelStyle}>
          Email *
        </label>
        <input
          id="contact-email"
          type="email"
          value={formData.email}
          onChange={handleChange("email")}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
          autoComplete="email"
          disabled={status === "submitting"}
          style={errors.email ? errorInputStyle : inputStyle}
        />
        {errors.email && (
          <p id="email-error" role="alert" style={errorTextStyle}>
            {errors.email}
          </p>
        )}
      </div>

      {/* Message field */}
      <div>
        <label htmlFor="contact-message" style={labelStyle}>
          Message *
        </label>
        <textarea
          id="contact-message"
          rows={6}
          value={formData.message}
          onChange={handleChange("message")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "message-error" : undefined}
          required
          disabled={status === "submitting"}
          style={{
            ...(errors.message ? errorInputStyle : inputStyle),
            resize: "vertical" as const,
            minHeight: "120px",
          }}
        />
        {errors.message && (
          <p id="message-error" role="alert" style={errorTextStyle}>
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={status === "submitting"}
        aria-busy={status === "submitting"}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.8125rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase" as const,
          padding: "var(--spacing-half) var(--spacing-grid)",
          border: "2px solid var(--color-border)",
          background:
            status === "submitting"
              ? "var(--color-bg-sunken)"
              : "var(--color-text-primary)",
          color:
            status === "submitting"
              ? "var(--color-text-muted)"
              : "var(--color-text-inverse)",
          cursor: status === "submitting" ? "not-allowed" : "pointer",
          boxShadow: "var(--shadow-brutal)",
          borderRadius: 0,
          transition:
            "transform var(--transition-fast), box-shadow var(--transition-fast)",
          alignSelf: "flex-start",
        }}
      >
        {status === "submitting" ? "Sending…" : "Send Message →"}
      </button>
    </form>
  );
}