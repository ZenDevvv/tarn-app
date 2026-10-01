/**
 * Password hashing.
 *
 * ## Why this package exists
 *
 * Authentication is MVP scope (D-0002) and password handling is used by two
 * workspaces: the API's auth module and the development seed. A shared package
 * is the correct seam, so `packages/auth` was added. This is a deviation from
 * architecture §6's package list and is recorded in `.wwg/wiki/project-truth.md`.
 *
 * ## Why scrypt
 *
 * Node's built-in `crypto.scrypt` is a memory-hard KDF and requires **no new
 * dependency** (architecture §92 rule 11: do not introduce infrastructure until
 * a real requirement exists — and the platform already provides this one).
 *
 * Tradeoffs, stated plainly:
 *   - These are scrypt cost parameters, not a bcrypt cost factor. They are
 *     tunable below if a security review wants them raised.
 *   - scrypt is slower per hash than bcrypt. Irrelevant at this product's
 *     scale; it would matter for a large user base.
 *   - If a future security review mandates Argon2id, `hashPassword` and
 *     `verifyPassword` are the only two functions to change. The stored format
 *     is self-describing, so existing hashes stay verifiable and can be
 *     upgraded on next successful login.
 *
 * ## Storage format
 *
 *   scrypt$<N>$<r>$<p>$<salt-b64>$<hash-b64>
 *
 * Self-describing, so cost parameters can change without invalidating existing
 * hashes. Never store or log a plaintext password.
 */
import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scryptAsync = promisify(scryptCallback) as (
  password: string,
  salt: Buffer,
  keylen: number,
  options: { N: number; r: number; p: number; maxmem: number },
) => Promise<Buffer>;

const ALGORITHM = 'scrypt';

/** N=2^15 costs roughly 50–100 ms per hash on typical hardware. */
const PARAMS = { N: 32768, r: 8, p: 1 } as const;

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;

/**
 * scrypt needs about 128 * N * r bytes. Node's default maxmem (32 MB) is below
 * what N=32768 requires, so it is raised explicitly. Omitting this is the
 * classic "Invalid scrypt params" failure.
 */
const MAXMEM = 256 * 1024 * 1024;

function deriveKey(
  password: string,
  salt: Buffer,
  params: { N: number; r: number; p: number },
): Promise<Buffer> {
  return scryptAsync(password, salt, KEY_LENGTH, { ...params, maxmem: MAXMEM });
}

/** Hash a plaintext password into a self-describing, storable string. */
export async function hashPassword(password: string): Promise<string> {
  if (typeof password !== 'string' || password.length === 0) {
    throw new Error('Cannot hash an empty password.');
  }

  const salt = randomBytes(SALT_LENGTH);
  const hash = await deriveKey(password, salt, PARAMS);

  return [ALGORITHM, PARAMS.N, PARAMS.r, PARAMS.p, salt.toString('base64'), hash.toString('base64')].join('$');
}

interface ParsedHash {
  params: { N: number; r: number; p: number };
  salt: Buffer;
  hash: Buffer;
}

function parseHash(stored: string): ParsedHash | null {
  const parts = stored.split('$');
  // algorithm, N, r, p, salt, hash
  if (parts.length !== 6) return null;

  const [algorithm, nRaw, rRaw, pRaw, saltRaw, hashRaw] = parts as [
    string,
    string,
    string,
    string,
    string,
    string,
  ];
  if (algorithm !== ALGORITHM) return null;

  const N = Number(nRaw);
  const r = Number(rRaw);
  const p = Number(pRaw);
  if (!Number.isInteger(N) || !Number.isInteger(r) || !Number.isInteger(p)) return null;
  if (N < 2 || r < 1 || p < 1) return null;

  const salt = Buffer.from(saltRaw, 'base64');
  const hash = Buffer.from(hashRaw, 'base64');
  if (salt.length === 0 || hash.length === 0) return null;

  return { params: { N, r, p }, salt, hash };
}

/**
 * Verify a plaintext password against a stored hash.
 *
 * Returns false rather than throwing for malformed stored values, so a corrupt
 * row denies access instead of crashing the auth path.
 */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (typeof password !== 'string' || typeof stored !== 'string') return false;

  const parsed = parseHash(stored);
  if (!parsed) return false;

  let derived: Buffer;
  try {
    derived = await deriveKey(password, parsed.salt, parsed.params);
  } catch {
    // A stored hash with parameters this machine cannot satisfy must not grant
    // access, and must not crash the request.
    return false;
  }

  if (derived.length !== parsed.hash.length) return false;
  return timingSafeEqual(derived, parsed.hash);
}

/** True when a stored hash uses parameters weaker than the current policy. */
export function needsRehash(stored: string): boolean {
  const parsed = parseHash(stored);
  if (!parsed) return true;
  return (
    parsed.params.N < PARAMS.N || parsed.params.r < PARAMS.r || parsed.params.p < PARAMS.p
  );
}