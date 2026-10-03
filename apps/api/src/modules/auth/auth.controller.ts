/**
 * Auth module — controller (architecture §20, §21).
 *
 * Controllers translate HTTP to service calls and back. No business logic and no
 * Prisma calls here (architecture §92 rules 1 and 2).
 */
import { signAccessToken, signRefreshToken, verifyToken } from '@tarn/auth';
import type { Request, Response } from 'express';
import { loginSchema, registerSchema } from '@tarn/validation';
import { getEnv } from '../../config/env.js';
import { unauthorized } from '../../middleware/error-handler.js';
import { ok } from '../../types/api.js';
import * as service from './auth.service.js';
import { REFRESH_COOKIE, clearAuthCookies, setAuthCookies } from './auth.cookies.js';

/** The user shape returned to the client. Never includes `passwordHash`. */
export async function register(req: Request, res: Response): Promise<void> {
  const input = registerSchema.parse(req.body);

  const { user } = await service.register(input);
  await issueTokens(res, user.id);

  res.status(201).json(ok({ user: toPublicUser(user) }));
}

export async function login(req: Request, res: Response): Promise<void> {
  const input = loginSchema.parse(req.body);

  const { user } = await service.login(input);
  await issueTokens(res, user.id);

  res.json(ok({ user: toPublicUser(user) }));
}

/**
 * Logout.
 *
 * Clears both cookies. **It cannot revoke an already-issued token** — that is the
 * accepted consequence of the owner's stateless decision recorded in
 * `packages/auth/src/token.ts` and current-task.md.
 *
 * Always 200, whether or not a session existed, so the endpoint reveals nothing
 * about the caller's state.
 */
export function logout(_req: Request, res: Response): void {
  clearAuthCookies(res);
  res.json(ok({ signedOut: true }));
}

/**
 * Exchange a refresh token for a fresh pair.
 *
 * Rotation: a successful refresh issues a new refresh token, so the value is
 * single-use in practice for an honest client. Without server-side storage it
 * cannot be *enforced* as single-use — see the trade-off note in `token.ts`.
 */
export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_COOKIE] as string | undefined;

  if (!token) throw unauthorized();

  const claims = await verifyRefresh(token);
  if (!claims) throw unauthorized();

  /**
   * Absolute session deadline.
   *
   * A refresh token with no `abs` claim is rejected rather than trusted. Without
   * this, a stolen refresh token could simply be renewed forever: every call
   * returned a fresh 7-day token, so the documented "7 day exposure" was really
   * "unbounded exposure" for anyone who kept renewing.
   *
   * The deadline is *carried forward* unchanged, so renewing can never extend it.
   */
  if (typeof claims.abs !== 'number' || claims.abs <= Math.floor(Date.now() / 1000)) {
    clearAuthCookies(res);
    throw unauthorized('Your session has expired. Sign in again.');
  }

  // A token for a user who no longer exists must not mint new sessions.
  const user = await service.resolveUser(claims.sub);

  await issueTokens(res, user.id, claims.abs);

  res.json(ok({ user: toPublicUser(user) }));
}

/**
 * Current user.
 *
 * `requireAuth` has already verified the access token and attached `userId`; this
 * re-reads the user so a deleted account returns 401 rather than stale claims.
 */
export async function me(req: Request, res: Response): Promise<void> {
  const userId = (req as { userId?: string }).userId;

  if (!userId) throw unauthorized();

  const user = await service.resolveUser(userId);

  res.json(ok({ user: toPublicUser(user) }));
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function issueTokens(res: Response, userId: string, absoluteExpiry?: number): Promise<void> {
  const { JWT_SECRET } = getEnv();
  const [accessToken, refreshToken] = await Promise.all([
    signAccessToken(userId, JWT_SECRET),
    // `absoluteExpiry` is passed through on refresh so the session ceiling is
    // preserved. Omitted at sign-in, where the session starts.
    signRefreshToken(userId, JWT_SECRET, absoluteExpiry),
  ]);
  setAuthCookies(res, accessToken, refreshToken);
}

async function verifyRefresh(token: string) {
  const { JWT_SECRET } = getEnv();
  return verifyToken(token, JWT_SECRET, 'refresh');
}

function toPublicUser(user: { id: string; email: string; name: string; createdAt: Date }) {
  return { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt.toISOString() };
}
