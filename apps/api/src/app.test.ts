/**
 * API smoke tests.
 *
 * Regression coverage for a real bug found during the scaffold: `health` was
 * mounted with `app.use(API_PREFIX, health)`. Express treats a 2-arity handler
 * passed to `app.use` as middleware, so it answered *every* request under
 * /api/v1 with the health payload and short-circuited all later routing.
 * `/api/v1/anything` returned 200 instead of 404.
 *
 * `.wwg/governance/test-enforcement.md` rule 2 requires a regression test for
 * a fixed bug. The `unknown routes 404` case below is that test.
 *
 * Env is injected via the test seam so the suite does not need a .env file or
 * a database.
 */
import express from 'express';
import request from 'supertest';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createApp, API_PREFIX } from './app.js';
import { __parseEnvForTests, __setEnvForTests } from './config/env.js';
import { requireAuth } from './middleware/auth.js';
import { asyncHandler } from './middleware/async-handler.js';
import { AppError } from './middleware/error-handler.js';

const testEnv = {
  NODE_ENV: 'test' as const,
  PORT: 4000,
  DATABASE_URL: 'postgresql://tarn:tarn@localhost:5432/tarn',
  // HS256 requires at least 32 characters (see packages/auth/src/token.ts).
  JWT_SECRET: 'test-jwt-secret-long-enough-for-hs256',
  COOKIE_SECRET: 'test-cookie-secret-at-least-32-chars',
  WEB_ORIGIN: 'http://localhost:5173',
};

beforeEach(() => {
  __setEnvForTests(testEnv);
});

afterEach(() => {
  __setEnvForTests(undefined);
});

describe('GET /api/v1/health', () => {
  it('returns the success envelope (architecture §27)', async () => {
    const response = await request(createApp()).get(`${API_PREFIX}/health`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: { status: 'ok', service: 'tarn-api' } });
  });

  it('sets a correlation id header (architecture §54)', async () => {
    const response = await request(createApp()).get(`${API_PREFIX}/health`);
    expect(response.headers['x-request-id']).toMatch(/[0-9a-f-]{36}/);
  });
});

describe('routing is not swallowed by the health route', () => {
  // Regression guard for the app.use vs app.get bug.
  it.each(['/api/v1/nope', '/api/v1/nope/deep', '/api/v1/applications', '/api/v1/companies/abc'])(
    'returns 404 for unknown route %s',
    async (route) => {
      const response = await request(createApp()).get(route);

      expect(response.status).toBe(404);
      // Must be the error envelope, not a leaked health payload.
      expect(response.body).toEqual({
        error: { code: 'not_found', message: 'Could not find that route.' },
      });
    },
  );

  it('does not answer health for a sub-path of health', async () => {
    const response = await request(createApp()).get(`${API_PREFIX}/health/extra`);
    expect(response.status).toBe(404);
  });

  it('returns 404 for an unknown root path', async () => {
    expect((await request(createApp()).get('/')).status).toBe(404);
  });
});

describe('request size limit (architecture §55)', () => {
  it('rejects an oversized JSON body with 413, not 500', async () => {
    const response = await request(createApp())
      .post(`${API_PREFIX}/health`)
      .set('content-type', 'application/json')
      .send({ blob: 'x'.repeat(2 * 1024 * 1024) });

    expect(response.status).toBe(413);
    expect(response.body.error.code).toBe('payload_too_large');
  });

  it('rejects malformed JSON with 400 and a readable message', async () => {
    const response = await request(createApp())
      .post(`${API_PREFIX}/health`)
      .set('content-type', 'application/json')
      .send('{"unclosed": ');

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe('bad_request');
  });
});

describe('requireAuth rejects unauthenticated requests', () => {
  // The guard used to answer 501 while auth was unimplemented. It now verifies a
  // real token, so the same property is asserted differently: a request without a
  // valid access token must never reach the handler.
  //
  // This remains the property that matters. A guard which called next() would
  // expose every protected route with no owner, violating the ownership
  // boundary (architecture §36, PRD §33).
  const app = express();
  app.get('/protected', requireAuth, (req, res) => {
    res.status(200).json({ userId: (req as { userId?: string }).userId ?? null });
  });

  it('rejects a request with no cookie instead of passing through', async () => {
    const response = await request(app).get('/protected');

    expect(response.status).toBe(401);
    expect(response.body).not.toHaveProperty('leaked');
  });

  it('rejects a forged access token', async () => {
    const response = await request(app).get('/protected').set('cookie', 'tarn_access=not.a.real.token');

    expect(response.status).toBe(401);
  });
});

describe('asyncHandler bridges rejections to the error handler', () => {
  // Regression guard. Express 4 does NOT catch rejected promises from handlers:
  // an async handler that rejects leaves the request hanging and the error
  // handler never runs. Every auth controller is async, and this exact bug made
  // 422s and 401s disappear into unhandled rejections. Express 5 fixes it
  // natively; until then every async route must be wrapped.
  const app = express();

  app.get(
    '/throws',
    asyncHandler(async () => {
      throw new AppError(409, 'email_taken', 'Conflict from an async handler.');
    }),
  );
  app.get(
    '/rejects',
    asyncHandler(async () => {
      await Promise.reject(new Error('raw failure with no status'));
    }),
  );
  // No other middleware before the error handler — a stray guard here would
  // reject first and mask the thing under test.
  app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = error instanceof AppError ? error.status : 500;
    res.status(status).json({ code: error instanceof AppError ? error.code : 'internal_error' });
  });

  it('routes a thrown AppError to the error handler with its status', async () => {
    const response = await request(app).get('/throws');

    expect(response.status).toBe(409);
    expect(response.body.code).toBe('email_taken');
  });

  it('routes a bare rejection to the error handler instead of hanging', async () => {
    const response = await request(app).get('/rejects');

    // Must resolve at all. Without the wrapper the request never responds.
    expect(response.status).toBe(500);
  });
});

describe('environment validation (architecture §57)', () => {
  // Regression guard. HS256 needs 256 bits of key material, so a secret under 32
  // characters cannot sign safely. The length check originally lived only inside
  // the token module, and the failure was a **500 on the first sign-up** — which is
  // exactly what §57 forbids, and it took out the CI `e2e` job on 2026-10-03
  // because that job's secret was 23 characters.
  //
  // The contract: a weak secret must be refused at startup, naming the variable.
  // Asserted against the schema directly, because `__setEnvForTests` writes the
  // cache and bypasses validation by design.
  it.each(['JWT_SECRET', 'COOKIE_SECRET'] as const)(
    'refuses to start when %s is too short, naming the variable',
    (variable) => {
      const result = __parseEnvForTests({ ...testEnv, [variable]: 'too-short' });

      expect(result.success).toBe(false);
      const issue = result.success ? undefined : result.error.issues[0];
      expect(issue?.path[0]).toBe(variable);
      expect(issue?.message).toMatch(/at least 32 characters/);
    },
  );

  it('accepts a long enough secret', () => {
    expect(__parseEnvForTests(testEnv).success).toBe(true);
  });

  it('names every missing variable rather than failing on the first', () => {
    const result = __parseEnvForTests({ NODE_ENV: 'test', PORT: '4000' });

    expect(result.success).toBe(false);
    const named = result.success ? [] : result.error.issues.map((i) => i.path[0]);
    expect(named).toContain('JWT_SECRET');
    expect(named).toContain('COOKIE_SECRET');
    expect(named).toContain('DATABASE_URL');
  });
});

describe('CORS (architecture §55)', () => {
  it('echoes an allowed origin and allows credentials', async () => {
    const response = await request(createApp())
      .get(`${API_PREFIX}/health`)
      .set('origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBe('http://localhost:5173');
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('does not echo an origin that is not allowed', async () => {
    const response = await request(createApp())
      .get(`${API_PREFIX}/health`)
      .set('origin', 'https://evil.example.com');

    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });
});
