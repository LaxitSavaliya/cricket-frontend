import { redirect } from "next/navigation";

import type { ReactNode } from "react";

import { isAuthenticatedServer } from "@/features/auth/auth.server";
import { getPlayerOnboardingStatusServer } from "@/features/player/player.server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = await isAuthenticatedServer();

  if (!isAuthenticated) {
    redirect("/login");
  }

  const onboarded = await getPlayerOnboardingStatusServer();

  if (onboarded === null) {
    redirect("/login");
  }

  if (onboarded === false) {
    redirect("/onboarding");
  }

  return children;
}
