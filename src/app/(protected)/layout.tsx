import { redirect } from "next/navigation";

import type { ReactNode } from "react";

import { isAuthenticatedServer } from "@/features/auth/auth.server";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const isAuthenticated = await isAuthenticatedServer();

  if (!isAuthenticated) {
    redirect("/login");
  }

  return children;
}
