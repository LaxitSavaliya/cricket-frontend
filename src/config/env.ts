import "server-only";

import type { ZodIssue } from "zod";
import { z } from "zod";

// ---------------------------------------------------------------------------
// Schema
// ---------------------------------------------------------------------------

/**
 * Zod schema that validates and transforms all required environment variables.
 * Add new variables here and they will be automatically validated at startup.
 */
const envSchema = z.object({
  /**
   * Base URL of the Cricket backend API.
   * Must be a fully-qualified HTTP/HTTPS URL with no trailing slash.
   * Should include API version path.
   *
   * @example "http://localhost:5000/api/v1"
   * @example "https://api.cricket.example.com/api/v1"
   */
  BACKEND_API_BASE_URL: z
    .string({
      message: "BACKEND_API_BASE_URL is required and must be a string",
    })
    .trim()
    .min(1, "BACKEND_API_BASE_URL must not be empty")
    .url("BACKEND_API_BASE_URL must be a valid URL")
    .refine((url) => url.startsWith("http://") || url.startsWith("https://"), {
      message: "BACKEND_API_BASE_URL must start with http:// or https://",
    })
    .transform((url) => url.replace(/\/+$/, "")),

  GOOGLE_CLIENT_ID: z
    .string({
      message: "GOOGLE_CLIENT_ID is required and must be a string",
    })
    .trim()
    .min(1, "GOOGLE_CLIENT_ID must not be empty")
    .refine((id) => id.endsWith(".apps.googleusercontent.com"), {
      message: "GOOGLE_CLIENT_ID must end with .apps.googleusercontent.com",
    }),
});

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type Env = z.output<typeof envSchema>;

// ---------------------------------------------------------------------------
// Custom error
// ---------------------------------------------------------------------------

export class EnvValidationError extends Error {
  public readonly issues: ZodIssue[];

  constructor(issues: ZodIssue[]) {
    const details = issues
      .map((issue) => {
        const path = issue.path.length > 0 ? issue.path.join(".") : "(root)";
        return `  • ${path}: ${issue.message}`;
      })
      .join("\n");

    super(`Invalid environment configuration:\n${details}`);

    this.name = "EnvValidationError";
    this.issues = issues;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

const parsed = envSchema.safeParse({
  BACKEND_API_BASE_URL: process.env.BACKEND_API_BASE_URL,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
});

if (!parsed.success) {
  throw new EnvValidationError(parsed.error.issues);
}

// ---------------------------------------------------------------------------
// Exports
// ---------------------------------------------------------------------------

export const env = Object.freeze({
  API_BASE_URL: parsed.data.BACKEND_API_BASE_URL,
  GOOGLE_CLIENT_ID: parsed.data.GOOGLE_CLIENT_ID,
} satisfies Record<string, string>);
