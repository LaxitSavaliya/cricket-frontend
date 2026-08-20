import type { ReactNode } from "react";

import { getCurrentUserServer } from "@/features/auth/auth.server";

export default async function LoginLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await getCurrentUserServer();

  if (user) {
    window.location.replace("/");
  }

  return children;
}
