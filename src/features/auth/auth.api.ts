import { http } from "@/lib/api/http";

import type { GoogleLoginRequest } from "./auth.types";

/**
 * Exchanges a Google ID token for an authenticated app session.
 */
export async function loginWithGoogle(
  payload: GoogleLoginRequest,
): Promise<void> {
  await http.post("/auth/google", payload);
}

/**
 * Invalidates the current user's session.
 */
export async function logoutUser(): Promise<void> {
  await http.post("/auth/logout");
}
