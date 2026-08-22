import axios, { type AxiosError } from "axios";

import type { ApiErrorPayload } from "./api-response";

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

export function isHttpError(error: unknown): error is HttpError {
  return error instanceof HttpError;
}

export const http = axios.create({
  baseURL: "/api",
  timeout: 10_000,
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response,

  (error: unknown) => {
    if (!axios.isAxiosError<ApiErrorPayload>(error)) {
      return Promise.reject(error);
    }

    const message =
      error.response?.data?.message ?? error.message ?? "Something went wrong.";

    return Promise.reject(new HttpError(message, error));
  },
);
