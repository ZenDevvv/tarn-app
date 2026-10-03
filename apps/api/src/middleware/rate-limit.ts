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

/**
 * Hard ceiling on tracked keys per limiter.
 *
 * Without this, memory is bounded by *requests per window* rather than by
 * anything fixed: an attacker who varies IP or email can mint unbounded live
 * buckets, and the sweep cannot help while they are all still inside their
 * window. That is CWE-770 and it was raised in review.
 *
 * 2,048 is generous for a single-user product — far more distinct clients than
 * this app will ever see in a 15-minute window — while keeping the worst-case
 * footprint small and the bound cheap to test.
 *
 * When the ceiling is reached the oldest live bucket is evicted to make room.
 * The trade-off is deliberate and stated: an attacker who floods the map can
 * evict a legitimate user's bucket, which weakens that user's limit for one
 * window. The alternative — failing closed for unseen keys — lets an attacker
 * lock out real users at will, which is worse. Bounded memory is the priority.
 */
const MAX_BUCKETS = 2_048;

export interface RateLimitOptions {
  /** Maximum requests allowed per window. */
  limit: number;
  /** Window length in seconds. */
  windowSeconds: number;
  /**
   * Derive the bucket key. Default: client IP.
   *
   * Login uses **two** limiters: one keyed by IP+email, and one keyed by IP
   * alone. The pair is deliberate — see auth.routes.ts.
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
  /**
   * Number of tracked keys.
   *
   * Exists so the memory bound can be asserted directly. Driving 10k+ requests
   * through HTTP to observe an internal map is slow and indirect; asserting the
   * bound needs the bound itself to be observable.
   */
  readonly size: () => number;
}

export function createRateLimiter(options: RateLimitOptions): RateLimiter {
  const { limit, windowSeconds, message, code } = options;
  const keyGenerator = options.keyGenerator ?? ((req) => req.ip ?? 'unknown');

  // Per-limiter state, shared across every request the limiter sees.
  //
  // Map preserves insertion order, and re-setting an existing key does not move
  // it, so the first entry is always the oldest live key. That makes eviction
  // O(1) — an earlier version scanned the whole map to find the minimum sequence
  // number, which meant an attacker at the ceiling could turn every request into
  // an O(n) scan. That was itself a denial-of-service vector.
  const buckets = new Map<string, Bucket>();

  /** Drop expired buckets. Bounded work: only runs once the map is large. */
  function sweep(now: number): void {
    if (buckets.size < 1000) return;
    for (const [key, bucket] of buckets) {
      if (bucket.resetAt <= now) buckets.delete(key);
    }
  }

  /** Evict the oldest live bucket once at the ceiling. O(1). */
  function makeRoom(): void {
    if (buckets.size < MAX_BUCKETS) return;
    const oldest = buckets.keys().next();
    if (!oldest.done) buckets.delete(oldest.value);
  }

  const middleware: RequestHandler = (req, res, next) => {
    const now = Date.now();
    sweep(now);

    const key = keyGenerator(req);
    const existing = buckets.get(key);

    if (!existing || existing.resetAt <= now) {
      // A new window for this key. Delete first so it moves to the end of the
      // insertion order, making the map's first entry the true oldest.
      makeRoom();
      buckets.delete(key);
      buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    } else {
      existing.count += 1;
    }

    const bucket = buckets.get(key)!;
    const count = bucket.count;

    const remaining = Math.max(0, limit - count);

    res.setHeader('RateLimit-Limit', String(limit));
    res.setHeader('RateLimit-Remaining', String(remaining));
    res.setHeader('RateLimit-Reset', String(Math.ceil(bucket.resetAt / 1000)));

    if (count > limit) {
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

  return { middleware, reset: () => buckets.clear(), size: () => buckets.size };
}
