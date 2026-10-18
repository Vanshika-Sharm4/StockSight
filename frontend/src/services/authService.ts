import axios from 'axios';
import { api } from './api';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function registerRequest(name: string, email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', { name, email, password });
  return data;
}

export async function loginRequest(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function meRequest(): Promise<AuthUser> {
  const { data } = await api.get<{ user: AuthUser }>('/auth/me');
  return data.user;
}

/** Turns any thrown error into a message that's safe to show on the form. */
export function getAuthErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const serverMessage = err.response?.data?.error;
    if (typeof serverMessage === 'string') return serverMessage;
    if (!err.response) return "Can't reach the server. Check your connection and try again.";
  }
  return 'Something went wrong. Please try again.';
}
