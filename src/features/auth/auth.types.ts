export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
}

export interface GoogleLoginResult {
  user: AuthUser;
}
