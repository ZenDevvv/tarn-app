/**
 * Authentication guard (architecture §37-§39, PRD §7.1).
 *
 * IMPORTANT — this scaffold deliberately fails closed.
 *
 * Authentication is MVP scope (D-0002) but is not implemented yet. The guard
 * therefore rejects every protected request with 501 rather than allowing it
 * through. It must never be a no-op pass-through: an unimplemented guard that
 * returns `next()` would expose every protected route with no owner, which
 * violates the ownership boundary in architecture §36 and PRD §33.
 *
 * Replace the body with real session/JWT verification when the auth module is
 * built. Until then, only `/api/v1/health` and the auth routes are reachable.
 */
import type { RequestHandler } from 'express';
import { AppError } from './error-handler.js';

export const requireAuth: RequestHandler = (_req, _res, next) => {
  next(new AppError(501, 'auth_not_implemented', 'Sign-in is not available yet. This is a scaffolded API.'));
};
