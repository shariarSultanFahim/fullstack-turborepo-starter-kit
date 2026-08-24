export interface AuthUser {
  id: string;
  name?: string | null;
  email: string;
  role?: string;
  avatar?: string | null;
  verified?: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken?: string;
  user?: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user?: AuthUser) => void;
  logout: () => void;
}
