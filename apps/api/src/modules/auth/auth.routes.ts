/**
 * Auth routes (architecture §38).
 *
 *   POST /api/v1/auth/register
 *   POST /api/v1/auth/login
 *   POST /api/v1/auth/logout
 *   POST /api/v1/auth/refresh
 *   GET  /api/v1/auth/me
 *
 * Deliberately absent: `/forgot-password` and `/reset-password`. See the
 * "Deferred" note below.
 *
 * ## Deferred — FR-AUTH-005, password recovery
 *
 * PRD §7.1 words password recovery as "should", and architecture §38 says
 * "Some routes may be deferred for MVP". It is deferred because it requires an
 * email delivery path, and REC-0005 (deployment vendors) is still undecided —
 * building it would pre-empt that decision.
 *
 * **This is a deliberate deferral, not an oversight.** Tracked as REC-0021.
 */
import { Router, type Router as ExpressRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import { createRateLimiter } from '../../middleware/rate-limit.js';
import * as controller from './auth.controller.js';

// Explicit annotation: the inferred type references a transitive path that is not
// portable across the workspace (TS2742).
export const router: ExpressRouter = Router();

/**
 * Rate limits (PRD §32, architecture §55).
 *
 * Register is the tighter of the two: it creates rows, so mass sign-up is the
 * abuse worth preventing. Login is looser because a real user can legitimately
 * mistype a password several times.
 *
 * Login's key folds in the submitted email so one attacker cannot lock a
 * legitimate user out by repeatedly failing their address.
 */
const registerLimiter = createRateLimiter({
  limit: 5,
  windowSeconds: 15 * 60,
  message: 'Too many accounts created from here. Try again later.',
  code: 'register_rate_limited',
});

/**
 * Login uses **two** limiters, and the second exists because of review.
 *
 * The obvious limiter keys on IP + email, so a user who mistypes a password a
 * few times is not blocked. But that key is also trivially defeated: an attacker
 * spraying **one password across a thousand accounts** produces a thousand
 * distinct (IP, email) keys, every one under the limit. That is CWE-307, raised
 * in review of this module.
 *
 *   - `loginPerAccountLimiter` (10 / 15 min, IP + email) — stops hammering one account
 *   - `loginPerIpLimiter` (50 / 15 min, IP) — stops spraying many accounts
 *
 * The generous IP ceiling is deliberate. Everyone behind one NAT or corporate
 * proxy shares an IP, so a tight IP limit would lock out legitimate users. The
 * per-account limiter still gives a real user a personal limit, and 50 sprayed
 * attempts in a quarter hour is far above what a legitimate shared network does.
 */
const loginPerAccountLimiter = createRateLimiter({
  limit: 10,
  windowSeconds: 15 * 60,
  message: 'Too many sign-in attempts. Try again in a few minutes.',
  code: 'login_rate_limited',
  keyGenerator: (req) => {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    return `${req.ip ?? 'unknown'}:${email}`;
  },
});

const loginPerIpLimiter = createRateLimiter({
  limit: 50,
  windowSeconds: 15 * 60,
  message: 'Too many sign-in attempts from this network. Try again in a few minutes.',
  code: 'login_rate_limited',
});

// Every controller is async and every one can throw (validation, bad credentials,
// a missing user). Each is wrapped so its rejection reaches the error handler
// instead of becoming an unhandled promise rejection. See middleware/async-handler.ts.
router.post('/register', registerLimiter.middleware, asyncHandler(controller.register));
router.post(
  '/login',
  loginPerIpLimiter.middleware,
  loginPerAccountLimiter.middleware,
  asyncHandler(controller.login),
);
router.post('/logout', asyncHandler(controller.logout));
router.post('/refresh', asyncHandler(controller.refresh));
router.get('/me', requireAuth, asyncHandler(controller.me));

/** Test seam — clears limiter counters so suites cannot throttle each other. */
export const __resetLimiters = () => {
  registerLimiter.reset();
  loginPerAccountLimiter.reset();
  loginPerIpLimiter.reset();
};
