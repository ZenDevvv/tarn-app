/**
 * Rate limiter unit tests.
 *
 * Two properties here are security properties, and both were raised in review:
 *
 *  1. **Bounded memory (CWE-770).** Without a ceiling, an attacker who varies the
 *     key — IP or email — mints unbounded live buckets, because the sweep cannot
 *     help while they are all inside their window.
 *
 *  2. **Honest rejection.** A tripped limit must produce 429 with `Retry-After`,
 *     never a 500.
 */
import express from 'express';
import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { errorHandler } from './error-handler.js';
import { createRateLimiter } from './rate-limit.js';

function appWith(limiter: ReturnType<typeof createRateLimiter>) {
  const app = express();
  app.get('/limited', limiter.middleware, (_req, res) => {
    res.json({ ok: true });
  });
  app.use(errorHandler);
  return app;
}

describe('createRateLimiter', () => {
  it('allows requests up to the limit, then rejects with 429', async () => {
    const limiter = createRateLimiter({ limit: 3, windowSeconds: 60 });
    const app = appWith(limiter);

    for (let n = 0; n < 3; n += 1) {
      expect((await request(app).get('/limited')).status).toBe(200);
    }

    const blocked = await request(app).get('/limited');
    expect(blocked.status).toBe(429);
    expect(blocked.body.error.code).toBe('rate_limited');
    expect(blocked.headers['retry-after']).toBeDefined();
  });

  it('reports standard RateLimit headers', async () => {
    const limiter = createRateLimiter({ limit: 5, windowSeconds: 60 });
    const app = appWith(limiter);

    const response = await request(app).get('/limited');

    expect(response.headers['ratelimit-limit']).toBe('5');
    expect(response.headers['ratelimit-remaining']).toBe('4');
    expect(response.headers['ratelimit-reset']).toBeDefined();
  });

  it('keys independently, so one noisy client does not block another', async () => {
    const limiter = createRateLimiter({
      limit: 1,
      windowSeconds: 60,
      keyGenerator: (req) => req.query.user as string,
    });
    const app = appWith(limiter);

    expect((await request(app).get('/limited?user=a')).status).toBe(200);
    expect((await request(app).get('/limited?user=a')).status).toBe(429);
    // A different key is unaffected.
    expect((await request(app).get('/limited?user=b')).status).toBe(200);
  });

  /**
   * CWE-770. The ceiling is 2,048 buckets; this proves the map cannot grow past
   * it however many distinct keys arrive.
   *
   * Drives the middleware directly rather than through HTTP. 12,000 supertest
   * round trips exceeded the suite timeout, and asserting a memory bound through
   * the network stack is indirect anyway — `size` is the thing under test.
   */
  it('bounds memory when keys are minted without bound (CWE-770)', () => {
    const limiter = createRateLimiter({
      limit: 1_000_000,
      windowSeconds: 3600,
      keyGenerator: (req) => String((req as { key?: string }).key),
    });

    // Minimal req/res doubles: the limiter reads the key off req, writes headers
    // to res, and calls next().
    const drive = (key: string) => {
      const res = { setHeader: () => undefined };
      let passed = false;
      limiter.middleware({ key } as never, res as never, () => {
        passed = true;
      });
      return passed;
    };

    // 5,000 distinct keys, all inside one live window, so the sweep cannot help.
    for (let n = 0; n < 5_000; n += 1) {
      drive(`key-${n}`);
    }

    expect(limiter.size()).toBeLessThanOrEqual(2_048);

    // Still serving rather than erroring: it degraded by evicting.
    expect(drive('one-more')).toBe(true);
    expect(limiter.size()).toBeLessThanOrEqual(2_048);
  });

  it('reset clears counters so a test suite cannot throttle itself', async () => {
    const limiter = createRateLimiter({ limit: 1, windowSeconds: 60 });
    const app = appWith(limiter);

    expect((await request(app).get('/limited')).status).toBe(200);
    expect((await request(app).get('/limited')).status).toBe(429);

    limiter.reset();

    expect((await request(app).get('/limited')).status).toBe(200);
  });
});
