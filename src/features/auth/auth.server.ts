import "server-only";

import { headers } from "next/headers";

import { env } from "@/config/env";
import type { ApiResponse } from "@/lib/api/api-response";

import type { AuthUser } from "./auth.types";

export async function getCurrentUserServer(): Promise<AuthUser | null> {
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(`${env.API_BASE_URL}/auth/me`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch current user: ${response.status}`);
  }

  const result = (await response.json()) as ApiResponse<AuthUser>;

  return result.data;
}
