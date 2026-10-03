/**
 * Global setup: create one shared account for the suite.
 *
 * ## Why this exists
 *
 * The register endpoint is rate-limited to 5 attempts per 15 minutes per IP
 * (PRD §32). Every Playwright request arrives from `127.0.0.1`, so a suite that
 * registers inside each test exhausts the limit partway through and the failures
 * look like application bugs. This was observed, not assumed: the run reported
 * `Too many accounts created from here` on the sixth registration.
 *
 * So the suite authenticates **once** here and reuses the session via
 * `storageState`, which is the idiomatic Playwright pattern. Registration itself
 * is still covered end to end, by this file and by the dedicated test in
 * `smoke.spec.ts`.
 *
 * The account is created through the real API, so this also proves the register
 * route works before any browser test runs.
 */
import type { FullConfig } from '@playwright/test';

export const E2E_PASSWORD = 'correct-horse-battery';

export default async function globalSetup(config: FullConfig): Promise<void> {
  const baseURL = config.projects[0]?.use?.baseURL as string | undefined;
  if (!baseURL) throw new Error('globalSetup needs a baseURL.');

  // The API port is not the web port, and a verification run may move both, so
  // the config publishes it explicitly rather than leaving this to guesswork.
  const apiRoot = process.env.E2E_API_URL ?? `${baseURL.replace(/:\d+$/, ':4000')}/api/v1`;
  const email = `e2e-${Math.random().toString(36).slice(2, 10)}@example.com`;

  const response = await fetch(`${apiRoot}/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: E2E_PASSWORD, name: 'E2E User' }),
  });

  if (!response.ok) {
    throw new Error(
      `globalSetup could not register the shared account: ${response.status} ${await response.text()}`,
    );
  }

  // Turn the Set-Cookie headers into a Playwright storageState.
  const raw = response.headers.getSetCookie();
  const origin = new URL(baseURL).hostname;
  const expires = Date.now() / 1000 + 3600;

  const cookies = raw.map((line) => {
    const [pair, ...attrs] = line.split(';').map((part) => part.trim());
    const eq = pair!.indexOf('=');
    const attrMap = new Map(
      attrs.map((a) => {
        const i = a.indexOf('=');
        return i === -1 ? [a.toLowerCase(), ''] : [a.slice(0, i).toLowerCase(), a.slice(i + 1)];
      }),
    );

    return {
      name: pair!.slice(0, eq),
      value: pair!.slice(eq + 1),
      domain: origin,
      path: attrMap.get('path') ?? '/',
      httpOnly: attrMap.has('httponly'),
      secure: attrMap.has('secure'),
      sameSite: (attrMap.get('samesite') ?? 'Lax') as 'Lax' | 'Strict' | 'None',
      expires,
    };
  });

  if (cookies.length === 0) {
    throw new Error('globalSetup received no session cookies from /auth/register.');
  }

  // Shared via env so specs can sign in again as this user.
  process.env.E2E_EMAIL = email;

  const { writeFileSync, mkdirSync } = await import('node:fs');
  const { dirname, resolve } = await import('node:path');

  // `config.rootDir` is the testDir (tests/e2e), so this lands at
  // tests/e2e/.auth/shared.json — the same path `storageState` resolves to.
  // Using `import.meta.url` is not an option: Playwright loads this file as
  // CommonJS, where `import.meta` is a syntax error.
  const statePath = resolve(config.rootDir, '.auth', 'shared.json');
  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(statePath, JSON.stringify({ cookies, origins: [] }, null, 2));
}
