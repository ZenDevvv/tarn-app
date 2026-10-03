/**
 * Fixed-window rate limiter (PRD §32, architecture §55).
 *
 * ## Why hand-rolled
 *
 * Owner decision, 2026-10-03: implement in memory rather than add
 * `express-rate-limit`. This product is a single-process personal MVP, and
 * architecture §92 rule 11 says not to introduce infrastructure before a real
 * requirement exists.
 *
 * ## The limitation, stated rather than buried
 *
 * **State is per-process and in memory.** Two consequences, both of which matter
 * and neither of which is fixed by this file:
 *
 *   1. Counters reset on restart, so a restart is an attacker-controlled reset.
 *   2. Counters are *not* shared across instances. If the API is ever scaled
 *      horizontally, the effective limit multiplies by the instance count and the
 *      limit stops being a limit.
 *
 * Revisit before horizontal scaling — recorded as REC-0020. The window and limit
 * are constructor arguments so swapping the backing store does not change call
 * sites.
 *
 * ## Why a fixed window
 *
 * A fixed window is simple and predictable. It permits a burst of up to 2x the
 * limit across a window boundary. That is an accepted trade-off for auth
 * endpoints at this scale; a sliding window would fix it and is not worth the
 * complexity here.
 */
import type { RequestHandler } from 'express';

interface Bucket {
  count: number;
  /** Epoch ms at which this bucket's window ends. */
  resetAt: number;
}

export interface RateLimitOptions {
  /** Maximum requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
  /**
   * Derive the bucket key. Default: client IP.
   *
   * Login also folds in the submitted email so one attacker cannot lock a victim
   * out by hammering their address, and so credential stuffing against many
   * accounts from one IP is still throttled.
   */
  keyGenerator?: (req: import('express').Request) => string;
  /** Message returned when the limit trips. DESIGN.md §12: state what to do. */
  message?: string;
  code?: string;
}

export interface RateLimiter {
  /** Express middleware. */
  middleware: RequestHandler;
  /**
   * Clear all counters.
   *
   * Needed because state is per-process and module-level: without this, one test
   * file's requests throttle the next test file's.
   */
  reset(): void;
}

export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const { limit, windowSeconds, message, code } = options;
  const keyGenerator = options.keyGenerator ?? ((req) => req.ip ?? 'unknown');

  // Per-limiter state, shared across every request the limiter sees.
  const buckets = new Map<string, Bucket>();

  /**
   * Evict expired buckets. Without this the map grows without bound, which is a
   * memory leak reachable by anyone who can vary their IP or email.
   */
  function sweep(now: number): void {
    if (buckets.size < 1000) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  const middleware: RequestHandler = (req, res, next) => {
    const now = Date.now();
    sweep(now);

    const key = keyGenerator(req);
    const existing = buckets.get(key);

    const bucket =
      existing && existing.resetAt > now ? existing : { count: 0, resetAt: now + windowSeconds * 1000 };

    bucket.count += 1;
    buckets.set(key, bucket);

    const remaining = Math.max(0, limit - bucket.count);

    res.setHeader('RateLimit-Limit', String(limit));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > limit) {
      const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));
      res.setHeader('Retry-After', String(retryAfter));
      next(
        Object.assign(new Error(message ?? 'Too many attempts. Wait a moment and try again.'), {
          status: 429,
          code: code ?? 'rate_limited',
        }),
      );
      return;
    }

    next();
  };

  return { middleware, reset: () => buckets.clear() };
}
