/**
 * Environment validation (architecture §57).
 *
 * The server must fail immediately if required config is missing rather than
 * failing later on the first request that touches a missing value.
 *
 * Only `VITE_`-prefixed variables reach the browser (architecture §56). Nothing
 * in this file may be exposed to the frontend.
 */
import { z } from 'zod';

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),

  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required.'),

  // HS256 requires at least 256 bits of key material (RFC 7518 §3.2), so a secret
  // shorter than 32 characters cannot sign safely.
  //
  // Validated here rather than only inside the token module, because architecture
  // §57 requires the server to fail at startup with a named variable. On
  // 2026-10-03 the length check lived only in `signToken`, and a too-short secret
  // surfaced as a 500 on the first sign-up instead — an unactionable error that
  // CI hit and a developer would have hit next.
  JWT_SECRET: z
    .string()
    .min(32, 'JWT_SECRET must be at least 32 characters. Generate one with: openssl rand -base64 48'),
  COOKIE_SECRET: z
    .string()
    .min(32, 'COOKIE_SECRET must be at least 32 characters. Generate one with: openssl rand -base64 48'),

  WEB_ORIGIN: z.string().min(1, 'WEB_ORIGIN is required.'),

  // Phase 2 only (Resume / CoverLetter) and Phase 3 only (AI). Optional so the
  // MVP does not depend on infrastructure it does not use (architecture §59).
  STORAGE_ENDPOINT: z.string().optional(),
  STORAGE_ACCESS_KEY: z.string().optional(),
  STORAGE_SECRET_KEY: z.string().optional(),
  STORAGE_BUCKET: z.string().optional(),
  AI_API_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

let cached: ServerEnv | undefined;

export function getEnv(): ServerEnv {
  if (cached) return cached;

  const parsed = serverEnvSchema.safeParse(process.env);

  if (!parsed.success) {
    const detail = parsed.error.issues
      .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
      .join('\n');

    // Fail loudly and usefully; this runs before the server accepts traffic.
    throw new Error(
      `Invalid environment configuration:\n${detail}\n\nCopy .env.example to .env and fill in the required values.`,
    );
  }

  cached = parsed.data;
  return cached;
}

/** CORS origins, derived from WEB_ORIGIN. */
export function getAllowedOrigins(): string[] {
  return getEnv()
    .WEB_ORIGIN.split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/** Test seam — lets a suite inject an env without mutating process.env. */
export function __setEnvForTests(env: ServerEnv | undefined): void {
  cached = env;
}

/**
 * Test seam — the raw schema, so a suite can assert what `getEnv` would reject.
 *
 * Needed because `__setEnvForTests` writes the cache directly and therefore
 * bypasses validation by design. Testing startup validation through it is not
 * possible, and asserting it indirectly would test nothing.
 */
export function __parseEnvForTests(source: unknown) {
  return serverEnvSchema.safeParse(source);
}
