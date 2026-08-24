import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { isAuthenticatedServer } from "@/features/auth/auth.server";
import { getPlayerOnboardingStatusServer } from "@/features/player/player.server";

export default async function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  const isAuthenticated = await isAuthenticatedServer();

  if (!isAuthenticated) {
    return children;
  }

  const onboarded = await getPlayerOnboardingStatusServer();

  if (onboarded === null) {
    return children;
  }

  if (onboarded === false) {
    redirect("/onboarding");
  }

  redirect("/dashboard");
}
