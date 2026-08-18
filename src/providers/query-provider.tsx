"use client";

import {
  QueryClient,
  QueryClientProvider,
  type QueryClientConfig,
} from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
import type { ReactNode } from "react";
import { useState } from "react";

import { isHttpError } from "@/lib/api/http";

interface QueryProviderProps {
  children: ReactNode;
}

const ReactQueryDevtools =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () =>
          import("@tanstack/react-query-devtools").then((mod) => ({
            default: mod.ReactQueryDevtools,
          })),
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

  if (axios.isAxiosError(error)) {
    return error.response?.status;
  }

  return undefined;
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2) {
    return false;
  }

  const status = getHttpStatus(error);

  if (status === undefined) {
    return true;
  }

  if (status >= 400 && status < 500) {
    return false;
  }

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
