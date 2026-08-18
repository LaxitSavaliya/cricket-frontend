import axios, { AxiosError } from "axios";

import { env } from "@/config/env";
import { getAccessToken, removeAccessToken } from "@/features/auth";
import type { ApiErrorPayload } from "./api-response";

// ---------------------------------------------------------------------------
// Custom HttpError Class
// ---------------------------------------------------------------------------

export class HttpError extends Error {
  public readonly status?: number;
  public readonly data?: ApiErrorPayload;
  public readonly originalError: AxiosError<ApiErrorPayload>;

  constructor(message: string, originalError: AxiosError<ApiErrorPayload>) {
    super(message);

    this.name = "HttpError";
    this.status = originalError.response?.status;
    this.data = originalError.response?.data;
    this.originalError = originalError;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Type guard to check if an error is an instance of HttpError.
 */
export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

export const http = axios.create({
  baseURL: env.API_BASE_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ---------------------------------------------------------------------------
// Request interceptor
// ---------------------------------------------------------------------------

http.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getAccessToken();

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// ---------------------------------------------------------------------------
// Response interceptor
// ---------------------------------------------------------------------------

http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorPayload>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      removeAccessToken();
      if (typeof window !== "undefined") {
        // eslint-disable-next-line @next/next/no-location-assign-relative-destination
        window.location.href = "/login";
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    return Promise.reject(new HttpError(message, error));
  },
);
