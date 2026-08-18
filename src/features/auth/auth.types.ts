/**
 * Payload sent to the backend after a successful Google Identity Services login.
 */
export interface GoogleLoginRequest {
  idToken: string;
}

/**
 * Shape of the authenticated user returned by the backend API.
 */
export interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
  hasPlayerProfile: boolean;
  hasOrganizerProfile: boolean;
}

/**
 * Response returned by POST /auth/google.
 */
export interface GoogleLoginResult {
  accessToken: string;
  isNewUser: boolean;
  requiresOnboarding?: boolean;
  user: AuthUser;
}
