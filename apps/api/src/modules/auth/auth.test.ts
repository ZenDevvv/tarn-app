/**
 * Auth route tests (PRD §7.1, architecture §37-§39, §55).
 *
 * These are the security-critical tests for the auth module, and they run against
 * a **real database** because the properties under test (unique email, cross-user
 * isolation, hash-at-rest) are database properties. They skip loudly when no
 * database is reachable, never silently.
 *
 * Ownership is PRD §35 item 12 and is required coverage under
 * `.wwg/governance/test-enforcement.md` rule 4.
 */
import { randomBytes } from 'node:crypto';
import { signRefreshToken, verifyPassword, verifyToken } from '@tarn/auth';
import { prisma } from '@tarn/database';
import request from 'supertest';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createApp, API_PREFIX } from '../../app.js';
import { __setEnvForTests } from '../../config/env.js';
import { __resetLimiters } from './auth.routes.js';

const JWT_SECRET = 'test-jwt-secret-long-enough-for-hs256';

const testEnv = {
  NODE_ENV: 'test' as const,
  PORT: 4000,
  DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://tarn:tarn@localhost:5432/tarn',
  JWT_SECRET,
  COOKIE_SECRET: 'test-cookie-secret-at-least-32-chars',
  WEB_ORIGIN: 'http://localhost:5173',
};

async function hasDatabase(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}

const dbAvailable = await hasDatabase();
const describeDb = dbAvailable ? describe : describe.skip;

if (!dbAvailable) {
  console.warn(
    '\n  [skipped] Auth route tests — no database reachable at DATABASE_URL.\n' +
      '             Start one with `docker compose up -d`, then run `pnpm db:deploy`.\n',
  );
}

const uniq = () => randomBytes(6).toString('hex');

/** Extract a named cookie from a supertest response. */
function cookieOf(response: request.Response, name: string): string | undefined {
  const raw = response.headers['set-cookie'];
  const list = Array.isArray(raw) ? raw : raw ? [raw] : [];
  return list
    .find((c) => c.startsWith(`${name}=`))
    ?.split(';')[0]
    ?.split('=')
    .slice(1)
    .join('=');
}

function cookieHeader(response: request.Response, name: string): string {
  return `${name}=${cookieOf(response, name) ?? ''}`;
}

describeDb('auth routes', () => {
  const created: string[] = [];

  beforeAll(async () => {
    __setEnvForTests(testEnv);
  });

  beforeEach(() => {
    __resetLimiters();
  });

  afterEach(async () => {
    // Clean up in reverse dependency order.
    await prisma.application.deleteMany({ where: { userId: { in: created } } });
    await prisma.user.deleteMany({ where: { id: { in: created } } });
    created.length = 0;
  });

  afterAll(async () => {
    __setEnvForTests(undefined);
    await prisma.$disconnect();
  });

  async function registerUser(overrides: Partial<{ email: string; password: string; name: string }> = {}) {
    const email = overrides.email ?? `auth-${uniq()}@example.com`;
    const response = await request(createApp())
      .post(`${API_PREFIX}/auth/register`)
      .send({
        email,
        password: overrides.password ?? 'correct-horse-battery',
        name: overrides.name ?? 'Auth Tester',
      });

    expect(response.status).toBe(201);
    created.push(response.body.data.user.id);
    return { email, password: overrides.password ?? 'correct-horse-battery', response };
  }

  // -------------------------------------------------------------------------
  // Registration
  // -------------------------------------------------------------------------

  describe('POST /auth/register', () => {
    it('creates the account and returns the public user', async () => {
      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/register`)
        .send({ email: `auth-${uniq()}@example.com`, password: 'correct-horse-battery', name: 'Sam' });

      expect(response.status).toBe(201);
      expect(response.body.data.user).toMatchObject({ email: expect.any(String), name: 'Sam' });
      created.push(response.body.data.user.id);
    });

    it('never returns the password hash', async () => {
      const { response } = await registerUser();

      expect(JSON.stringify(response.body)).not.toContain('scrypt$');
      expect(response.body.data.user).not.toHaveProperty('passwordHash');
    });

    it('stores the password hashed, never in plaintext (D-0006)', async () => {
      const { email } = await registerUser({ password: 'plaintext-should-never-persist' });

      const row = await prisma.user.findUnique({ where: { email } });
      expect(row?.passwordHash).toMatch(/^scrypt\$/);
      expect(row?.passwordHash).not.toContain('plaintext-should-never-persist');
      expect(await verifyPassword('plaintext-should-never-persist', row!.passwordHash)).toBe(true);
    });

    it('sets httpOnly session cookies and signs the user in immediately', async () => {
      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/register`)
        .send({ email: `auth-${uniq()}@example.com`, password: 'correct-horse-battery', name: 'Sam' });
      created.push(response.body.data.user.id);

      const setCookie = response.headers['set-cookie'] as unknown as string[];

      expect(setCookie.some((c) => c.startsWith('tarn_access='))).toBe(true);
      expect(setCookie.some((c) => c.startsWith('tarn_refresh='))).toBe(true);
      // httpOnly is what keeps the token out of JS storage (architecture §37).
      expect(setCookie.every((c) => /HttpOnly/i.test(c))).toBe(true);
      expect(setCookie.every((c) => /SameSite=Lax/i.test(c))).toBe(true);
    });

    it('normalizes the email so login finds it however it is typed', async () => {
      const mixed = `Auth.Mixed-${uniq()}@Example.COM`;
      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/register`)
        .send({ email: mixed, password: 'correct-horse-battery', name: 'Sam' });
      created.push(response.body.data.user.id);

      expect(response.body.data.user.email).toBe(mixed.toLowerCase());

      const login = await request(createApp())
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: mixed, password: 'correct-horse-battery' });

      expect(login.status).toBe(200);
    });

    it('rejects a duplicate email with 409', async () => {
      const { email } = await registerUser();

      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/register`)
        .send({ email, password: 'correct-horse-battery', name: 'Someone Else' });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('email_taken');
    });

    it.each([
      { field: 'email', payload: { email: 'not-an-email', password: 'correct-horse-battery' } },
      { field: 'password', payload: { email: `x-${uniq()}@example.com`, password: 'short' } },
      {
        field: 'name',
        payload: { email: `x-${uniq()}@example.com`, password: 'correct-horse-battery', name: '' },
      },
    ])('rejects an invalid $field with 422 and a field message', async ({ payload }) => {
      const response = await request(createApp()).post(`${API_PREFIX}/auth/register`).send(payload);

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('validation_failed');
      expect(response.body.error.fields).toBeDefined();
    });

    it('rate-limits repeated registrations from one client', async () => {
      const app = createApp();

      const attempt = (n: number) =>
        request(app)
          .post(`${API_PREFIX}/auth/register`)
          .send({
            email: `burst-${n}-${uniq()}@example.com`,
            password: 'correct-horse-battery',
            name: 'Burst',
          });

      const responses = [];
      for (let n = 0; n < 7; n += 1) responses.push(await attempt(n));

      const limited = responses.filter((r) => r.status === 429);
      expect(limited.length).toBeGreaterThan(0);
      expect(limited[0]?.body.error.code).toBe('register_rate_limited');
      expect(limited[0]?.headers['retry-after']).toBeDefined();
    });
  });

  // -------------------------------------------------------------------------
  // Login
  // -------------------------------------------------------------------------

  describe('POST /auth/login', () => {
    it('signs in with correct credentials', async () => {
      const { email, password } = await registerUser();

      const response = await request(createApp()).post(`${API_PREFIX}/auth/login`).send({ email, password });

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe(email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('rejects a wrong password with 401', async () => {
      const { email } = await registerUser();

      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/login`)
        .send({ email, password: 'wrong-password-entirely' });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('invalid_credentials');
    });

    /**
     * Account-enumeration defence (PRD §32).
     *
     * If these two responses differ in status, code, or message, the login form
     * becomes an oracle for which email addresses have accounts.
     */
    it('responds identically for an unknown email and a wrong password', async () => {
      const { email } = await registerUser();
      const app = createApp();

      const unknown = await request(app)
        .post(`${API_PREFIX}/auth/login`)
        .send({ email: `nobody-${uniq()}@example.com`, password: 'correct-horse-battery' });

      const wrongPassword = await request(app)
        .post(`${API_PREFIX}/auth/login`)
        .send({ email, password: 'definitely-not-the-password' });

      expect(unknown.status).toBe(wrongPassword.status);
      expect(unknown.body.error.code).toBe(wrongPassword.body.error.code);
      expect(unknown.body.error.message).toBe(wrongPassword.body.error.message);
    });

    it('rate-limits repeated failed sign-ins', async () => {
      const { email } = await registerUser();
      const app = createApp();

      const responses = [];
      for (let n = 0; n < 12; n += 1) {
        responses.push(
          await request(app)
            .post(`${API_PREFIX}/auth/login`)
            .send({ email, password: `wrong-${n}` }),
        );
      }

      const limited = responses.filter((r) => r.status === 429);
      expect(limited.length).toBeGreaterThan(0);
      expect(limited[0]?.body.error.code).toBe('login_rate_limited');
    });
  });

  // -------------------------------------------------------------------------
  // Current user
  // -------------------------------------------------------------------------

  describe('GET /auth/me', () => {
    it('returns the signed-in user', async () => {
      const { response: registerResponse } = await registerUser();

      const response = await request(createApp())
        .get(`${API_PREFIX}/auth/me`)
        .set('cookie', cookieHeader(registerResponse, 'tarn_access'));

      expect(response.status).toBe(200);
      expect(response.body.data.user.email).toBe(registerResponse.body.data.user.email);
    });

    it('rejects with no cookie', async () => {
      const response = await request(createApp()).get(`${API_PREFIX}/auth/me`);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('unauthorized');
    });

    /**
     * Token-kind confusion.
     *
     * A refresh token must not authenticate a request. Without this the 7-day
     * refresh token would also work as an access token, which is the whole point
     * of separating them.
     */
    it('rejects a refresh token presented as an access token', async () => {
      const { response: registerResponse } = await registerUser();

      const response = await request(createApp())
        .get(`${API_PREFIX}/auth/me`)
        .set('cookie', cookieHeader(registerResponse, 'tarn_refresh'));

      expect(response.status).toBe(401);
    });

    it('rejects a token signed with a different secret', async () => {
      const { response: registerResponse } = await registerUser();
      const stolen = cookieOf(registerResponse, 'tarn_access');
      const tampered = `${stolen?.split('.')[0]}.${stolen?.split('.')[1]}.invalidsignature`;

      const response = await request(createApp())
        .get(`${API_PREFIX}/auth/me`)
        .set('cookie', `tarn_access=${tampered}`);

      expect(response.status).toBe(401);
    });

    it('returns 401 once the account is deleted, even with a valid token', async () => {
      const { response: registerResponse } = await registerUser();
      const userId = registerResponse.body.data.user.id;
      const access = cookieHeader(registerResponse, 'tarn_access');

      // The token is still cryptographically valid; the user is gone.
      await prisma.user.delete({ where: { id: userId } });

      const response = await request(createApp()).get(`${API_PREFIX}/auth/me`).set('cookie', access);

      expect(response.status).toBe(401);
    });
  });

  // -------------------------------------------------------------------------
  // Refresh and logout
  // -------------------------------------------------------------------------

  describe('POST /auth/refresh', () => {
    it('issues a new access token from a valid refresh token', async () => {
      const { response: registerResponse } = await registerUser();

      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/refresh`)
        .set('cookie', cookieHeader(registerResponse, 'tarn_refresh'));

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.body.data.user.id).toBe(registerResponse.body.data.user.id);
    });

    it('rotates the refresh token rather than reissuing the same value', async () => {
      const { response: registerResponse } = await registerUser();
      const app = createApp();

      const refreshed = await request(app)
        .post(`${API_PREFIX}/auth/refresh`)
        .set('cookie', cookieHeader(registerResponse, 'tarn_refresh'));

      expect(cookieOf(refreshed, 'tarn_refresh')).toBeDefined();
      expect(cookieOf(refreshed, 'tarn_refresh')).not.toBe(cookieOf(registerResponse, 'tarn_refresh'));
    });

    it('rejects with no refresh cookie', async () => {
      const response = await request(createApp()).post(`${API_PREFIX}/auth/refresh`);

      expect(response.status).toBe(401);
    });

    it('rejects an access token presented as a refresh token', async () => {
      const { response: registerResponse } = await registerUser();

      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/refresh`)
        .set('cookie', cookieHeader(registerResponse, 'tarn_access'));

      expect(response.status).toBe(401);
    });

    /**
     * The absolute session deadline (raised in review).
     *
     * A stolen refresh token must not be renewable forever. These tests mint a
     * token whose session deadline has already passed and require the server to
     * refuse it, rather than issuing another week.
     */
    it('refuses to renew a session past its absolute deadline', async () => {
      const { response: registerResponse } = await registerUser();
      const { JWT_SECRET } = testEnv;

      const expiredSession = await signRefreshToken(
        registerResponse.body.data.user.id,
        JWT_SECRET,
        Math.floor(Date.now() / 1000) - 60,
      );

      const response = await request(createApp())
        .post(`${API_PREFIX}/auth/refresh`)
        .set('cookie', `tarn_refresh=${expiredSession}`);

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('unauthorized');
    });

    it('carries the absolute deadline forward instead of resetting it', async () => {
      const { response: registerResponse } = await registerUser();

      const app = createApp();

      const first = await request(app)
        .post(`${API_PREFIX}/auth/refresh`)
        .set('cookie', cookieHeader(registerResponse, 'tarn_refresh'));
      expect(first.status).toBe(200);

      const second = await request(app)
        .post(`${API_PREFIX}/auth/refresh`)
        .set('cookie', cookieHeader(first, 'tarn_refresh'));
      expect(second.status).toBe(200);

      const deadlineOf = async (response: request.Response) => {
        const token = cookieOf(response, 'tarn_refresh');
        expect(token).toBeDefined();
        const claims = await verifyToken(token!, testEnv.JWT_SECRET, 'refresh');
        return claims!.abs;
      };

      const original = await deadlineOf(registerResponse);
      const afterFirst = await deadlineOf(first);
      const afterSecond = await deadlineOf(second);

      // Two renewals must not push the ceiling out by another 30 days each.
      expect(afterFirst).toBe(original);
      expect(afterSecond).toBe(original);
    });
  });

  describe('POST /auth/logout', () => {
    it('clears both session cookies', async () => {
      const response = await request(createApp()).post(`${API_PREFIX}/auth/logout`);

      expect(response.status).toBe(200);
      const setCookie = response.headers['set-cookie'] as unknown as string[];
      expect(setCookie.some((c) => c.startsWith('tarn_access='))).toBe(true);
      expect(setCookie.some((c) => c.startsWith('tarn_refresh='))).toBe(true);
      // Expired immediately, so the browser drops them.
      expect(setCookie.every((c) => /Max-Age=0|Expires=Thu, 01 Jan 1970/i.test(c))).toBe(true);
    });

    it('succeeds without a session, revealing nothing about the caller', async () => {
      const response = await request(createApp()).post(`${API_PREFIX}/auth/logout`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({ signedOut: true });
    });
  });

  // -------------------------------------------------------------------------
  // Rate limiting — PRD §32, architecture §55
  // -------------------------------------------------------------------------

  describe('rate limiting', () => {
    /**
     * Regression guard for CWE-307 (improper restriction of excessive
     * authentication attempts).
     *
     * The first implementation keyed only on IP + email. An attacker spraying
     * one password across many accounts produced a distinct key per account, so
     * every attempt landed under the limit and none were throttled. An IP-only
     * limiter now runs alongside the per-account one.
     */
    it('throttles spraying one password across many different accounts', async () => {
      const app = createApp();

      const responses = [];
      for (let n = 0; n < 60; n += 1) {
        responses.push(
          await request(app)
            .post(`${API_PREFIX}/auth/login`)
            .send({ email: `victim-${n}-${uniq()}@example.com`, password: 'sprayed-password' }),
        );
      }

      const limited = responses.filter((r) => r.status === 429);
      // Every (IP, email) pair here is unique, so no single pair ever reaches the
      // per-account ceiling of 10 — the per-account limiter provably cannot be
      // what stopped this. Only the IP limiter can have.
      expect(limited.length).toBeGreaterThan(0);
      expect(limited[0]?.body.error.code).toBe('login_rate_limited');
      // And it stopped at the IP ceiling rather than somewhere arbitrary.
      expect(limited.length).toBe(responses.length - 50);
      // 30 seconds, not the 5s default: every one of these 60 requests runs a real
      // scrypt verification on the unknown-email path, which is the timing
      // equalisation the design depends on. That work is deliberate, so the test
      // budget has to reflect it rather than skip the hashing to go faster.
    }, 30_000);

    it('still allows a normal user several wrong attempts before blocking them', async () => {
      const { email } = await registerUser();
      const app = createApp();

      const responses = [];
      for (let n = 0; n < 6; n += 1) {
        responses.push(
          await request(app)
            .post(`${API_PREFIX}/auth/login`)
            .send({ email, password: `wrong-${n}` }),
        );
      }

      // Mistyping is not abuse, and the per-account ceiling is 10.
      expect(responses.every((r) => r.status === 401)).toBe(true);
    });
  });

  // -------------------------------------------------------------------------
  // Cross-user isolation — PRD §35 item 12
  // -------------------------------------------------------------------------

  describe('cross-user isolation', () => {
    it("resolves only the token holder's own user", async () => {
      const alice = await registerUser({ name: 'Alice' });
      const bob = await registerUser({ name: 'Bob' });
      const app = createApp();

      // Two distinct accounts exist. Bob's token must not resolve to Alice.
      expect(alice.response.body.data.user.id).not.toBe(bob.response.body.data.user.id);

      const bobSees = await request(app)
        .get(`${API_PREFIX}/auth/me`)
        .set('cookie', cookieHeader(bob.response, 'tarn_access'));

      expect(bobSees.status).toBe(200);
      expect(bobSees.body.data.user.name).toBe('Bob');
      expect(bobSees.body.data.user.name).not.toBe('Alice');
      expect(bobSees.body.data.user.email).toBe(bob.email);
    });

    it('cannot mint a session for another user by forging a subject', async () => {
      const alice = await registerUser({ name: 'Alice' });

      expect(alice.response.body.data.user.name).toBe('Alice');

      // Re-sign Alice's token with a tampered payload but the original signature.
      const token = cookieOf(alice.response, 'tarn_access')!;
      const [header, , signature] = token.split('.');
      const forged = Buffer.from(
        JSON.stringify({ sub: 'clxsomeotheruser0000000000000', kind: 'access' }),
      ).toString('base64url');

      const response = await request(createApp())
        .get(`${API_PREFIX}/auth/me`)
        .set('cookie', `tarn_access=${header}.${forged}.${signature}`);

      expect(response.status).toBe(401);
    });
  });
});
