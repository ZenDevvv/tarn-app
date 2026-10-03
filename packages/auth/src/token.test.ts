/**
 * Token tests.
 *
 * Security-critical behaviour, so these assert *rejection* paths explicitly.
 * A test suite for signing that only checks the happy path would pass even if
 * verification were broken.
 */
import { describe, expect, it } from 'vitest';
import { SignJWT } from 'jose';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
  signAccessToken,
  signRefreshToken,
  verifyToken,
} from './token.js';

const SECRET = 'test-secret-that-is-long-enough-to-pass-validation';
const OTHER_SECRET = 'a-completely-different-secret-of-sufficient-length';
const USER_ID = 'clx0000000000000000000000';

describe('sign and verify', () => {
  it('round-trips a user id through an access token', async () => {
    const token = await signAccessToken(USER_ID, SECRET);
    const claims = await verifyToken(token, SECRET, 'access');

    expect(claims).not.toBeNull();
    expect(claims?.sub).toBe(USER_ID);
    expect(claims?.kind).toBe('access');
  });

  it('round-trips a user id through a refresh token', async () => {
    const token = await signRefreshToken(USER_ID, SECRET);
    const claims = await verifyToken(token, SECRET, 'refresh');

    expect(claims?.sub).toBe(USER_ID);
    expect(claims?.kind).toBe('refresh');
  });
});

describe('token kind separation', () => {
  // This is the check that stops a stolen refresh token being used directly as
  // an access token, which would turn a 15-minute exposure into a 7-day one.
  it('rejects an access token presented as a refresh token', async () => {
    const token = await signAccessToken(USER_ID, SECRET);
    expect(await verifyToken(token, SECRET, 'refresh')).toBeNull();
  });

  it('rejects a refresh token presented as an access token', async () => {
    const token = await signRefreshToken(USER_ID, SECRET);
    expect(await verifyToken(token, SECRET, 'access')).toBeNull();
  });
});

describe('rejection paths', () => {
  it('rejects a token signed with a different secret', async () => {
    const token = await signAccessToken(USER_ID, OTHER_SECRET);
    expect(await verifyToken(token, SECRET, 'access')).toBeNull();
  });

  it('rejects a tampered payload', async () => {
    const token = await signAccessToken(USER_ID, SECRET);
    const [header, , signature] = token.split('.') as [string, string, string];
    const forged = Buffer.from(JSON.stringify({ sub: 'attacker', kind: 'access' })).toString('base64url');
    expect(await verifyToken(`${header}.${forged}.${signature}`, SECRET, 'access')).toBeNull();
  });

  it('rejects an expired token', async () => {
    const expired = await new SignJWT({ kind: 'access' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setSubject(USER_ID)
      .setIssuedAt(Math.floor(Date.now() / 1000) - 7200)
      .setExpirationTime(Math.floor(Date.now() / 1000) - 3600)
      .sign(new TextEncoder().encode(SECRET));

    expect(await verifyToken(expired, SECRET, 'access')).toBeNull();
  });

  it('rejects a token signed with a different algorithm', async () => {
    // `alg: none` is the classic JWT downgrade attack. Verifying against an
    // explicit allow-list is what defeats it.
    const unsigned = await new SignJWT({ kind: 'access' })
      .setProtectedHeader({ alg: 'HS256' })
      .setSubject(USER_ID)
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(SECRET));
    const [, payload] = unsigned.split('.');
    const noneHeader = Buffer.from(JSON.stringify({ alg: 'none', typ: 'JWT' })).toString('base64url');

    expect(await verifyToken(`${noneHeader}.${payload}.`, SECRET, 'access')).toBeNull();
  });

  it('rejects garbage input without throwing', async () => {
    const garbage = ['', 'not-a-token', 'a.b.c', '....'];
    for (const value of garbage) {
      expect(await verifyToken(value, SECRET, 'access')).toBeNull();
    }
  });

  it('rejects a token with no subject', async () => {
    const noSubject = await new SignJWT({ kind: 'access' })
      .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
      .setExpirationTime('1h')
      .sign(new TextEncoder().encode(SECRET));

    expect(await verifyToken(noSubject, SECRET, 'access')).toBeNull();
  });
});

describe('secret strength', () => {
  it('refuses to sign with a short secret rather than using a weak key', async () => {
    await expect(signAccessToken(USER_ID, 'too-short')).rejects.toThrow(/at least 32 characters/);
  });

  it('refuses to sign with an empty secret', async () => {
    await expect(signAccessToken(USER_ID, '')).rejects.toThrow(/at least 32 characters/);
  });
});

describe('lifetimes', () => {
  it('keeps the access token far shorter than the refresh token', () => {
    expect(ACCESS_TOKEN_TTL_SECONDS).toBeLessThan(REFRESH_TOKEN_TTL_SECONDS);
    expect(ACCESS_TOKEN_TTL_SECONDS).toBeLessThanOrEqual(30 * 60);
  });

  it('sets an expiry consistent with the documented lifetimes', async () => {
    const access = await verifyToken(await signAccessToken(USER_ID, SECRET), SECRET, 'access');
    const refresh = await verifyToken(await signRefreshToken(USER_ID, SECRET), SECRET, 'refresh');

    const lifetime = (claims: { exp?: number; iat?: number } | null) =>
      (claims?.exp ?? 0) - (claims?.iat ?? 0);

    expect(lifetime(access)).toBe(ACCESS_TOKEN_TTL_SECONDS);
    expect(lifetime(refresh)).toBe(REFRESH_TOKEN_TTL_SECONDS);
  });
});
