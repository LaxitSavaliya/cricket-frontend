"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import type { ReactNode } from "react";

interface GoogleAuthProviderProps {
  children: ReactNode;
  clientId: string;
}

export function GoogleAuthProvider({
  children,
  clientId,
}: GoogleAuthProviderProps) {
  return (
    <GoogleOAuthProvider clientId={clientId}>{children}</GoogleOAuthProvider>
  );
}
