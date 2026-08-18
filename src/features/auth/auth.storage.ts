export const ACCESS_TOKEN_KEY = "accessToken";

/**
 * Safely retrieves the stored JWT access token from localStorage.
 */
export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to read access token from storage:", error);
    return null;
  }
}

/**
 * Safely persists the JWT access token to localStorage.
 */
export function setAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to write access token to storage:", error);
  }
}

/**
 * Safely removes the JWT access token from localStorage.
 */
export function removeAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.error("Failed to remove access token from storage:", error);
  }
}

/**
 * Checks whether an access token currently exists in localStorage.
 */
export function hasAccessToken(): boolean {
  return Boolean(getAccessToken());
}
