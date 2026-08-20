import type { ApiResponse } from "@/lib/api/api-response";
import { http } from "@/lib/api/http";

import type {
  AuthUser,
  GoogleLoginRequest,
  GoogleLoginResult,
} from "./auth.types";

/**
 * Exchanges a Google ID token for an authenticated app session
 * and returns the user profile.
 */
export async function loginWithGoogle(
  payload: GoogleLoginRequest,
): Promise<GoogleLoginResult> {
  const { data } = await http.post<ApiResponse<GoogleLoginResult>>(
    "/auth/google",
    payload,
  );

  return data.data;
}

/**
 * Fetches the currently authenticated user's profile.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  const { data } = await http.get<ApiResponse<AuthUser>>("/auth/me");

  return data.data;
}

/**
 * Invalidates the current user's session on the server.
 */
export async function logoutUser(): Promise<void> {
  await http.post("/auth/logout");
}
