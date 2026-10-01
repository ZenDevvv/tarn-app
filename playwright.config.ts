import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration (architecture §62, §63).
 *
 * Scope note: the MVP user journeys from PRD §62 — register, login, create
 * application, move status, follow-up, search/filter, logout — are **not**
 * written yet, because none of those features exist. What runs today is a
 * smoke suite plus the accessibility checks that jsdom cannot perform
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

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      // DESIGN.md §11 requires every component to work at 360px. This project
      // enforces it rather than leaving it to manual review.
      name: 'mobile',
      use: { ...devices['Pixel 5'] },
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
        DATABASE_URL:
          process.env.DATABASE_URL ?? 'postgresql://tarn:tarn@localhost:5432/tarn?schema=public',
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