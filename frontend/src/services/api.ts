import axios from 'axios';

const TOKEN_KEY = 'stocksight_token';

// localStorage can throw (private windows, blocked storage), so every access is wrapped.
export const tokenStorage = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string) {
    try {
      localStorage.setItem(TOKEN_KEY, token);
    } catch {
      /* ignore */
    }
  },
  clear() {
    try {
      localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};

export const UNAUTHORIZED_EVENT = 'stocksight:unauthorized';

// Shared axios client: automatically attaches the sign-in token to every request.
export const api = axios.create({
  // In local dev, set VITE_API_URL=http://localhost:5050/api in frontend/.env.
  // In production (Docker/AWS), leave unset - nginx proxies /api to the backend container.
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// If the server says our session is invalid/expired (outside the sign-in
// forms themselves), drop the token and tell the app to go back to /auth.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const url: string = error?.config?.url ?? '';
    if (error?.response?.status === 401 && !url.startsWith('/auth/')) {
      tokenStorage.clear();
      window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
    }
    return Promise.reject(error);
  },
);
