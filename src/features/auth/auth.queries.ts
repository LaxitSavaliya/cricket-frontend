"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationOptions,
  type UseMutationResult,
  type UseQueryOptions,
  type UseQueryResult,
} from "@tanstack/react-query";
import { useEffect } from "react";

import { HttpError, isHttpError } from "@/lib/api/http";
import { getCurrentUser, loginWithGoogle, logoutUser } from "./auth.api";
import {
  ACCESS_TOKEN_KEY,
  getAccessToken,
  hasAccessToken,
  removeAccessToken,
  setAccessToken,
} from "./auth.storage";
import type {
  AuthUser,
  GoogleLoginRequest,
  GoogleLoginResult,
} from "./auth.types";

/**
 * Centralized Query Keys for authentication state and cached user session.
 */
export const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

export type UseGoogleLoginOptions<TContext = unknown> = Omit<
  UseMutationOptions<
    GoogleLoginResult,
    HttpError,
    GoogleLoginRequest,
    TContext
  >,
  "mutationFn"
>;

export type UseLogoutOptions<TContext = unknown> = Omit<
  UseMutationOptions<void, HttpError, void, TContext>,
  "mutationFn"
>;

/**
 * Query hook to fetch the authenticated user profile (/auth/me).
 *
 * - Automatically purges the access token on 401 Unauthorized errors.
 * - Stops retrying on 401 and 403, but retains token on 403 (forbidden/unauthorized resource).
 */
export function useCurrentUserQuery(
  options?: Omit<
    UseQueryOptions<AuthUser, HttpError, AuthUser, readonly ["auth", "user"]>,
    "queryKey" | "queryFn"
  >,
): UseQueryResult<AuthUser, HttpError> {
  return useQuery({
    queryKey: authKeys.user(),
    queryFn: async () => {
      try {
        return await getCurrentUser();
      } catch (error) {
        if (isHttpError(error) && error.status === 401) {
          removeAccessToken();
        }
        throw error;
      }
    },
    enabled: options?.enabled ?? hasAccessToken(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      // 401 & 403 should never retry
      if (
        isHttpError(error) &&
        (error.status === 401 || error.status === 403)
      ) {
        return false;
      }
      return failureCount < 2;
    },
    ...options,
  });
}

/**
 * React Query mutation hook to authenticate with Google Identity Services.
 *
 * Automatically persists the access token to localStorage and primes the user query cache.
 */
export function useGoogleLoginMutation<TContext = unknown>(
  options?: UseGoogleLoginOptions<TContext>,
): UseMutationResult<
  GoogleLoginResult,
  HttpError,
  GoogleLoginRequest,
  TContext
> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: loginWithGoogle,
    ...options,
    onSuccess: (data, variables, onMutateResult, context) => {
      setAccessToken(data.accessToken);

      // Seed authoritative user profile in cache
      queryClient.setQueryData(authKeys.user(), data.user);

      options?.onSuccess?.(data, variables, onMutateResult, context);
    },
  });
}

/**
 * React Query mutation hook to log out the user (best-effort).
 *
 * Cancels active auth queries, performs local cleanup, and removes query cache.
 */
export function useLogoutMutation<TContext = unknown>(
  options?: UseLogoutOptions<TContext>,
): UseMutationResult<void, HttpError, void, TContext> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        await logoutUser();
      } catch (error) {
        // Best-effort: server logout failure shouldn't prevent local logout
        console.warn(
          "Server logout failed, proceeding with local logout:",
          error,
        );
      }
    },
    ...options,
    onSettled: async (data, error, variables, onMutateResult, context) => {
      // Cancel in-flight queries before removing cache to avoid race conditions
      await queryClient.cancelQueries({ queryKey: authKeys.all });
      removeAccessToken();
      queryClient.removeQueries({ queryKey: authKeys.all });

      options?.onSettled?.(data, error, variables, onMutateResult, context);
    },
  });
}

/**
 * Ergonomic hook providing full auth state, actions, and cross-tab synchronization.
 */
export function useAuth() {
  const queryClient = useQueryClient();
  const userQuery = useCurrentUserQuery();
  const loginMutation = useGoogleLoginMutation();
  const logoutMutation = useLogoutMutation();

  // Cross-tab synchronization via storage event listener
  useEffect(() => {
    function handleStorageChange(event: StorageEvent) {
      if (event.key === ACCESS_TOKEN_KEY) {
        if (!event.newValue) {
          // Token removed in another tab -> cancel queries and remove cached user
          void queryClient.cancelQueries({ queryKey: authKeys.all });
          queryClient.removeQueries({ queryKey: authKeys.all });
        } else {
          // Token updated in another tab -> re-fetch current user
          void queryClient.invalidateQueries({ queryKey: authKeys.user() });
        }
      }
    }

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [queryClient]);

  const token = typeof window !== "undefined" ? getAccessToken() : null;
  const isAuthenticated = Boolean(token && userQuery.data);

  return {
    user: userQuery.data ?? null,
    isAuthenticated,
    isLoading: userQuery.isLoading && Boolean(token),
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    error: userQuery.error ?? loginMutation.error ?? logoutMutation.error,
    loginWithGoogle: loginMutation.mutate,
    loginWithGoogleAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,
    logoutAsync: logoutMutation.mutateAsync,
    refetchUser: userQuery.refetch,
  };
}
