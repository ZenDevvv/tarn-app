/**
 * Authentication guard (architecture §37-§39, PRD §7.1, D-0002).
 *
 * Replaces the scaffold's 501 guard. The scaffold failed closed by design; this
 * verifies a real access token and resolves the caller's id.
 *
 * ## The ownership boundary (architecture §36, §39, PRD §32-§33)
 *
 * This middleware establishes *who* the caller is. It does **not** establish
 * *what* they may reach. Every protected route must additionally scope its query
 * by `req.userId` (architecture §92 rule 6) — a verified token alone is not
 * sufficient, and a route that reads by id without a userId filter exposes the
 * whole database.
 */
import type { RequestHandler } from 'express';
import { verifyToken } from '@tarn/auth';
import { getEnv } from '../config/env.js';
import { unauthorized } from './error-handler.js';
import { ACCESS_COOKIE } from '../modules/auth/auth.cookies.js';

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const token = req.cookies?.[ACCESS_COOKIE] as string | undefined;

    if (!token) {
      next(unauthorized());
      return;
    }

    const claims = await verifyToken(token, getEnv().JWT_SECRET, 'access');

    if (!claims) {
      // One message for absent, malformed, expired and wrong-kind tokens. A
      // distinct "expired" response would help an attacker distinguish cases.
      next(unauthorized('Your session has ended. Sign in again.'));
      return;
    }

    // Downstream handlers read this; see AuthenticatedRequest.
    (req as { userId?: string }).userId = claims.sub;

    next();
  } catch (error) {
    next(error);
  }
};
