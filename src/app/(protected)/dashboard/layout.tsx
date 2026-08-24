import { redirect } from "next/navigation";

import type { ReactNode } from "react";

import { getPlayerOnboardingStatusServer } from "@/features/player/player.server";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const onboarded = await getPlayerOnboardingStatusServer();

  if (onboarded === null) {
    redirect("/login");
  }

  if (!onboarded) {
    redirect("/onboarding");
  }

  return children;
}
