import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { authRateLimit, requireAuth, signToken, type AuthedRequest } from '../middleware/auth';
import { createUser, EmailTakenError, findUserByEmail, findUserById } from '../services/userStore';
import type { AuthResponse, LoginRequest, PublicUser, RegisterRequest, StoredUser } from '../types/auth';

const router = Router();

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 8;

function toPublic(user: StoredUser): PublicUser {
  return { id: user.id, name: user.name, email: user.email };
}

router.post('/register', authRateLimit, async (req, res) => {
  const { name, email, password } = (req.body ?? {}) as Partial<RegisterRequest>;

  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ error: 'Please enter your name.' });
  }
  if (typeof email !== 'string' || !EMAIL_RE.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (typeof password !== 'string' || password.length < MIN_PASSWORD) {
    return res.status(400).json({ error: `Password must be at least ${MIN_PASSWORD} characters.` });
  }
  if (password.length > 72) {
    // bcrypt only uses the first 72 bytes; reject rather than silently truncate.
    return res.status(400).json({ error: 'Password is too long (max 72 characters).' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createUser(name.trim(), email.trim(), passwordHash);
    const body: AuthResponse = { token: signToken(user.id), user: toPublic(user) };
    res.status(201).json(body);
  } catch (err) {
    if (err instanceof EmailTakenError) {
      return res.status(409).json({ error: 'An account with that email already exists.' });
    }
    console.error('Register error:', err);
    res.status(500).json({ error: 'Could not create account. Please try again.' });
  }
});

router.post('/login', authRateLimit, async (req, res) => {
  const { email, password } = (req.body ?? {}) as Partial<LoginRequest>;

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await findUserByEmail(email.trim());
    // Same message for "no such user" and "wrong password" so the form
    // can't be used to find out which emails have accounts.
    const ok = user ? await bcrypt.compare(password, user.passwordHash) : false;
    if (!user || !ok) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }
    const body: AuthResponse = { token: signToken(user.id), user: toPublic(user) };
    res.json(body);
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Could not sign in. Please try again.' });
  }
});

router.get('/me', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const user = req.userId ? await findUserById(req.userId) : undefined;
    if (!user) return res.status(401).json({ error: 'Account no longer exists' });
    res.json({ user: toPublic(user) });
  } catch (err) {
    console.error('Me error:', err);
    res.status(500).json({ error: 'Could not load account.' });
  }
});

export default router;
