import "server-only";

import { headers } from "next/headers";

import { env } from "@/config/env";

export async function isAuthenticatedServer(): Promise<boolean> {
  const requestHeaders = await headers();
  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    return false;
  }

  const response = await fetch(`${env.API_BASE_URL}/auth/player/session`, {
    method: "GET",
    headers: {
      cookie: cookieHeader,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    return false;
  }

  if (!response.ok) {
    throw new Error(`Failed to check authentication: ${response.status}`);
  }

  return true;
}
