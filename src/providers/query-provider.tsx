"use client";

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useState, type ReactNode } from "react";

import { isHttpError } from "@/lib/api/http";

interface QueryProviderProps {
  children: ReactNode;
}

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then(
            (mod) => mod.ReactQueryDevtools,
          ),
        {
          ssr: false,
        },
      )
    : null;

const SECOND = 1000;
const MINUTE = 60 * SECOND;

function getHttpStatus(error: unknown): number | undefined {
  if (isHttpError(error)) {
    return error.status;
  }

  return undefined;
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }

  const status = getHttpStatus(error);

  // Network error / unknown error
  if (status === undefined) {
    return true;
  }

  // Don't retry client errors
  if (status >= 400 && status < 500) {
    return false;
  }

  // Retry server errors
  return status >= 500;
}

const queryClientConfig = {
  defaultOptions: {
    queries: {
      staleTime: 1 * MINUTE,
      gcTime: 10 * MINUTE,

      retry: shouldRetryQuery,

      retryDelay: (attemptIndex) =>
        Math.min(SECOND * 2 ** attemptIndex, 30 * SECOND),

      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      refetchOnMount: true,
    },

    mutations: {
      retry: false,
    },
  },
} satisfies QueryClientConfig;

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient(queryClientConfig));

  return (
    <QueryClientProvider client={queryClient}>
      {children}

      {ReactQueryDevtools ? <ReactQueryDevtools initialIsOpen={false} /> : null}
    </QueryClientProvider>
  );
}
