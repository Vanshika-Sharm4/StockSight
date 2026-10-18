import { createContext, useContext } from 'react';
import type { AppUser } from '../types/dashboard';

export interface AuthContextValue {
  user: AppUser | null;
  /** true while we check whether a saved session is still valid on first load */
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
