import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { getCurrentUserServer } from "@/features/auth/auth.server";

export default async function ProtectedLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUserServer();

  if (!user) {
    redirect("/login");
  }

  return children;
}
