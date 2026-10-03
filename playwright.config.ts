import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration (architecture §62, §63).
 *
 * ## Why `channel` instead of the bundled browser
 *
 * `playwright install chromium` fails in this environment — the Chromium
 * download is blocked. Rather than leave E2E unverified, the suite drives the
 * **system-installed** Chrome or Edge via Playwright's `channel` option, which
 * requires no download.
 *
 * `PW_CHANNEL` selects which one:
 *   - `msedge` (default) — ships with Windows, so it is always present
 *   - `chrome`            — use if you prefer Chrome
 *   - unset               — fall back to Playwright's bundled Chromium, which is
 *                           what CI will use after `playwright install --with-deps`
 *
 * The installed-browser path is a *local convenience*. CI should use the pinned
 * bundled Chromium so results are reproducible against a known engine version.
 */
const channel = process.env.PW_CHANNEL ?? 'msedge';

/**
 * The API base URL, published so `globalSetup` can create the shared account
 * before any browser test runs. Kept next to the webServer block below so the two
 * cannot drift apart.
 */
process.env.E2E_API_URL = 'http://localhost:4000/api/v1';

const browser = channel ? { channel } : {};

/**
 * Scope note: the MVP user journeys from architecture §62 — register, login,
 * create application, move status, follow-up, search/filter, logout — are
 * **not** written yet, because none of those features exist. What runs today is
 * a smoke suite plus the accessibility checks that jsdom cannot perform
 * (DESIGN.md §11 requires a real browser for contrast, focus order and touch
 * targets).
 *
 * Add the real journeys as each feature ships; do not write placeholder specs
 * for unimplemented behaviour.
 */
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],

  /**
   * One shared account, created once before the suite runs.
   *
   * Registering inside every test exhausts the register rate limit (5 per 15
   * minutes per IP) partway through the run, because all browser traffic arrives
   * from 127.0.0.1. See tests/e2e/global-setup.ts.
   */
  globalSetup: './tests/e2e/global-setup.ts',

  use: {
    baseURL: 'http://localhost:5173',
    storageState: 'tests/e2e/.auth/shared.json',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    ...browser,
  },

  projects: [
    {
      name: 'desktop',
      testIgnore: /global-setup\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // DESIGN.md §11 requires every component to work at 360px. This project
      // enforces it rather than leaving it to manual review.
      name: 'mobile-360',
      testIgnore: /global-setup\.ts/,
      use: { ...devices['Desktop Chrome'], viewport: { width: 360, height: 740 } },
    },
  ],

  webServer: [
    {
      command: 'pnpm --filter @tarn/api dev',
      url: 'http://localhost:4000/api/v1/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        NODE_ENV: 'development',
        PORT: '4000',
        DATABASE_URL: process.env.DATABASE_URL ?? 'postgresql://tarn:tarn@localhost:5432/tarn?schema=public',
        JWT_SECRET: 'e2e-only-jwt-secret',
        COOKIE_SECRET: 'e2e-only-cookie-secret',
        WEB_ORIGIN: 'http://localhost:5173',
      },
    },
    {
      command: 'pnpm --filter @tarn/web dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120_000,
      env: {
        VITE_API_URL: 'http://localhost:4000/api/v1',
      },
    },
  ],
});
