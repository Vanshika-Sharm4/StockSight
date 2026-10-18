import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';

// Set JWT_SECRET in backend/.env (e.g. `openssl rand -hex 32`). If it is
// missing we fall back to a random secret so the app still runs, but every
// restart will sign everyone out, so a warning is printed.
// Read lazily (not at import time) so dotenv has already loaded backend/.env.
let cachedSecret: string | null = null;
function getSecret(): string {
  if (cachedSecret) return cachedSecret;
  cachedSecret = process.env.JWT_SECRET || null;
  if (!cachedSecret) {
    cachedSecret = randomBytes(32).toString('hex');
    console.warn('[auth] JWT_SECRET is not set - using a temporary secret. Users will be signed out on every restart.');
  }
  return cachedSecret;
}

const TOKEN_TTL = '7d';

export interface AuthedRequest extends Request {
  userId?: string;
}

export function signToken(userId: string): string {
  return jwt.sign({ sub: userId }, getSecret(), { expiresIn: TOKEN_TTL });
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  try {
    const payload = jwt.verify(header.slice(7), getSecret()) as jwt.JwtPayload;
    if (!payload.sub) throw new Error('Missing subject');
    req.userId = payload.sub;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' });
  }
}

// Minimal in-memory rate limiter for the sign-in / sign-up endpoints, so
// passwords can't be guessed at machine speed. One bucket per client IP.
const attempts = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;

export function authRateLimit(req: Request, res: Response, next: NextFunction) {
  const key = req.ip || 'unknown';
  const now = Date.now();
  const entry = attempts.get(key);

  if (!entry || entry.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return next();
  }
  entry.count += 1;
  if (entry.count > MAX_ATTEMPTS) {
    return res.status(429).json({ error: 'Too many attempts. Please try again in a few minutes.' });
  }
  next();
}
