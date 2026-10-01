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

  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required.'),
  COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required.'),

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