/**
 * Auth module — cookie policy (architecture §37, §55).
 *
 * Centralised here because cookie flags are the security boundary for session
 * handling, and they must not be decided at five call sites.
 */
import type { CookieOptions, Response } from 'express';
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from '@tarn/auth';

export const ACCESS_COOKIE = 'tarn_access';
export const REFRESH_COOKIE = 'tarn_refresh';

/**
 * Shared cookie policy.
 *
 *   httpOnly — architecture §37 forbids putting the token in JS storage, so the
 *              browser must never expose it to scripts. This is what makes
 *              XSS unable to steal the session.
 *   sameSite 'lax' — blocks cross-site POSTs, which is the CSRF defence for a
 *              cookie-authenticated API (architecture §55 "CSRF protection
 *              where applicable"). 'strict' would break nothing here but offers
 *              no benefit over 'lax' for a first-party SPA.
 *   secure   — set outside development only. A secure cookie is not sent over
 *              plain http, so leaving this on in local dev makes sign-in appear
 *              to silently fail. NODE_ENV therefore gates it explicitly rather
 *              than relying on a proxy's forwarded protocol.
 *   path     — '/' for access so every protected route receives it.
 */
function baseCookie(maxAgeSeconds: number): CookieOptions {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: maxAgeSeconds * 1000,
  };
}

export function setAuthCookies(res: Response, accessToken: string, refreshToken: string): void {
  res.cookie(ACCESS_COOKIE, accessToken, baseCookie(ACCESS_TOKEN_TTL_SECONDS));
  // Scoped to the auth prefix so the refresh token is not attached to every
  // application request. Narrower than '/', and it is the only place it is used.
  res.cookie(REFRESH_COOKIE, refreshToken, {
    ...baseCookie(REFRESH_TOKEN_TTL_SECONDS),
    path: '/api/v1/auth',
  });
}

export function clearAuthCookies(res: Response): void {
  // Must mirror the original path on each cookie, or the browser keeps the
  // original and the user stays signed in after logout.
  res.clearCookie(ACCESS_COOKIE, { path: '/' });
  res.clearCookie(REFRESH_COOKIE, { path: '/api/v1/auth' });
}
