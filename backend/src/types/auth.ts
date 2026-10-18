export interface StoredUser {
  id: string;
  name: string;
  email: string; // always stored lowercase
  passwordHash: string;
  createdAt: string;
}

export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  token: string;
  user: PublicUser;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
