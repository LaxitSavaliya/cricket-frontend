import "server-only";

import { headers } from "next/headers";

import { env } from "@/config/env";
import type { ApiResponse } from "@/lib/api/api-response";
import type { PlayerOnboardingStatus } from "./player.types";

export async function getPlayerOnboardingStatusServer(): Promise<
  boolean | null
> {
  const requestHeaders = await headers();

  const cookieHeader = requestHeaders.get("cookie");

  if (!cookieHeader) {
    return null;
  }

  const response = await fetch(
    `${env.API_BASE_URL}/players/onboarding-status`,
    {
      method: "GET",
      headers: {
        cookie: cookieHeader,
      },
      cache: "no-store",
    },
  );

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch player onboarding status: ${response.status}`,
    );
  }

  const result = (await response.json()) as ApiResponse<PlayerOnboardingStatus>;

  return result.data.onboarded;
}
