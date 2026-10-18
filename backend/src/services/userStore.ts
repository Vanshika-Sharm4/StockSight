import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import type { StoredUser } from '../types/auth';

// Users live in a single JSON file. That is plenty for a portfolio project
// and needs no database. In Docker, DATA_DIR is mounted as a volume so
// accounts survive container rebuilds (see docker-compose.yml).
// To scale this up later, swap these functions for a real database
// (Postgres, DynamoDB, ...) - nothing else in the app touches the file.
const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// Serialize writes so two simultaneous sign-ups can't clobber each other.
let queue: Promise<unknown> = Promise.resolve();
function enqueue<T>(task: () => Promise<T>): Promise<T> {
  const run = queue.then(task, task);
  queue = run.catch(() => undefined);
  return run;
}

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw) as StoredUser[];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw err;
  }
}

async function writeUsers(users: StoredUser[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${USERS_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(users, null, 2), 'utf-8');
  await fs.rename(tmp, USERS_FILE); // atomic swap, avoids half-written files
}

export async function findUserByEmail(email: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.email === email.toLowerCase());
}

export async function findUserById(id: string): Promise<StoredUser | undefined> {
  const users = await readUsers();
  return users.find((u) => u.id === id);
}

export class EmailTakenError extends Error {}

export function createUser(name: string, email: string, passwordHash: string): Promise<StoredUser> {
  return enqueue(async () => {
    const users = await readUsers();
    const normalized = email.toLowerCase();
    if (users.some((u) => u.email === normalized)) {
      throw new EmailTakenError('Email already registered');
    }
    const user: StoredUser = {
      id: randomUUID(),
      name,
      email: normalized,
      passwordHash,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    await writeUsers(users);
    return user;
  });
}
