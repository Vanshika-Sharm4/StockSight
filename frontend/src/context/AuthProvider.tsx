import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { AuthContext, type AuthContextValue } from './authContext';
import { tokenStorage, UNAUTHORIZED_EVENT } from '../services/api';
import { loginRequest, meRequest, registerRequest, type AuthUser } from '../services/authService';
import type { AppUser } from '../types/dashboard';

function toAppUser(u: AuthUser): AppUser {
  return { name: u.name, firstName: u.name.trim().split(/\s+/)[0], email: u.email };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(() => tokenStorage.get() !== null);

  // On first load, if a token is saved, check with the server that it's still valid.
  useEffect(() => {
    if (!tokenStorage.get()) return;
    let cancelled = false;
    meRequest()
      .then((u) => !cancelled && setUser(toAppUser(u)))
      .catch(() => tokenStorage.clear())
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  // The API client fires this when the server rejects our token mid-session.
  useEffect(() => {
    const onUnauthorized = () => setUser(null);
    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token, user: u } = await loginRequest(email, password);
    tokenStorage.set(token);
    setUser(toAppUser(u));
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { token, user: u } = await registerRequest(name, email, password);
    tokenStorage.set(token);
    setUser(toAppUser(u));
  }, []);

  const signOut = useCallback(() => {
    tokenStorage.clear();
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signUp, signOut }),
    [user, loading, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
