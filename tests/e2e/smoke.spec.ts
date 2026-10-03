/**
 * End-to-end tests.
 *
 * Covers the auth journey and the app shell:
 *   - a signed-out visitor is redirected from the dashboard to sign in
 *   - a new account can be created and reaches the dashboard
 *   - signing out returns to sign-in and the dashboard is protected again
 *   - the API health wiring works through the browser
 *
 * Plus the accessibility contract in DESIGN.md §11, which jsdom cannot verify:
 * real contrast, focus order, and touch-target size need a browser engine.
 *
 * **Session handling.** Most tests reuse the shared account created by
 * `global-setup.ts`. Only the tests that are specifically about authentication
 * sign out or register, because the register endpoint is rate-limited per IP.
 */
import { expect, test, type Page } from '@playwright/test';

/** Set by global-setup.ts for the account it created. */
const SHARED_EMAIL = () => process.env.E2E_EMAIL ?? '';
const PASSWORD = process.env.E2E_PASSWORD ?? 'correct-horse-battery';

/**
 * Drop the shared session so a test starts signed out.
 *
 * Navigates first: the page begins on `about:blank`, so the sign-out control
 * does not exist until the shell has rendered.
 */
async function signOut(page: Page) {
  await page.goto('/dashboard');
  await page.getByRole('button', { name: /sign out/i }).click();
  await expect(page).toHaveURL(/\/login$/);
}

test.describe('auth journey', () => {
  test('sends a signed-out visitor from the dashboard to sign in', async ({ page }) => {
    await signOut(page);

    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByRole('heading', { name: 'Sign in' })).toBeVisible();
  });

  test('redirects the root path onward and ends at the dashboard when signed in', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  // The one test that registers. Registering here rather than everywhere else is
  // what keeps the suite inside the per-IP register rate limit.
  test('creates an account and lands on the dashboard', async ({ page }) => {
    await signOut(page);

    const email = `e2e-signup-${Math.random().toString(36).slice(2, 10)}@example.com`;

    await page.goto('/register');
    await page.getByLabel('Name').fill('Sam Newly Signed Up');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    // The shell identifies the session by name, not by email address.
    await expect(page.getByText('Sam Newly Signed Up')).toBeVisible();
  });

  test('signs in again after signing out', async ({ page }) => {
    await signOut(page);

    await page.getByLabel('Email').fill(SHARED_EMAIL());
    await page.getByLabel('Password').fill(PASSWORD);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });

  test('rejects a wrong password and stays on the form', async ({ page }) => {
    await signOut(page);

    await page.getByLabel('Email').fill(SHARED_EMAIL());
    await page.getByLabel('Password').fill('definitely-not-the-password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    // The message must not reveal whether the address exists.
    await expect(page.getByRole('alert')).toContainText(/email or password is incorrect/i);
    await expect(page).toHaveURL(/\/login$/);
  });

  test('protects the dashboard again after signing out', async ({ page }) => {
    await signOut(page);

    // Returning to a protected URL must bounce back to sign in.
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });
});

test.describe('app shell', () => {
  test('renders the product name and primary navigation', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('banner')).toBeVisible();
    // `exact` matters: "Tarn" also appears inside "Connected to tarn-api."
    await expect(page.getByText('Tarn', { exact: true })).toBeVisible();
    await expect(page.getByRole('navigation', { name: 'Primary' })).toBeVisible();
  });

  test('shows the empty state that invites a first action', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText(/no applications yet/i)).toBeVisible();
    await expect(page.getByText(/add your first one/i)).toBeVisible();
  });

  test('confirms the API is connected', async ({ page }) => {
    await page.goto('/dashboard');

    // Proves the browser -> API -> frontend wiring works end to end.
    await expect(page.getByText(/connected to tarn-api/i)).toBeVisible();
  });

  test('has exactly one h1 on the dashboard', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.locator('h1')).toHaveCount(1);
  });
});

test.describe('accessibility (DESIGN.md §11)', () => {
  test('the skip link receives focus on first Tab', async ({ page }) => {
    await page.goto('/dashboard');

    await page.keyboard.press('Tab');

    const focusedText = await page.evaluate(() => document.activeElement?.textContent ?? '');
    expect(focusedText).toMatch(/skip to content/i);
  });

  test('main landmarks exist and are unique', async ({ page }) => {
    await page.goto('/dashboard');

    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('header')).toHaveCount(1);
    await expect(page.locator('footer')).toHaveCount(0);
  });

  test('every interactive control has an accessible name', async ({ page }) => {
    await page.goto('/dashboard');

    const controls = page.locator('a[href], button, input, select, textarea');
    const count = await controls.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i += 1) {
      const control = controls.nth(i);
      const name = await control.evaluate((el: Element) => {
        const aria = el.getAttribute('aria-label');
        if (aria) return aria;
        const labelledBy = el.getAttribute('aria-labelledby');
        if (labelledBy) {
          const target = document.getElementById(labelledBy);
          if (target?.textContent) return target.textContent;
        }
        if (el.id) {
          const label = document.querySelector(`label[for="${el.id}"]`);
          if (label?.textContent) return label.textContent;
        }
        return (el as HTMLElement).innerText || el.getAttribute('name') || '';
      });

      expect(name.trim(), `control ${i} needs an accessible name`).not.toBe('');
    }
  });

  test('the sign-in form labels every field', async ({ page }) => {
    await signOut(page);
    await page.goto('/login');

    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    // The registration form has a name field; sign-in must not.
    await expect(page.getByLabel('Name')).toHaveCount(0);
  });

  test('body text meets 4.5:1 contrast in both themes', async ({ page }) => {
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      await page.goto('/dashboard');

      const failures = await page.evaluate(() => {
        const parse = (value: string): [number, number, number] => {
          const parts = value.match(/\d+(\.\d+)?/g)!.map(Number);
          return [parts[0]!, parts[1]!, parts[2]!];
        };
        const luminance = ([r, g, b]: [number, number, number]) => {
          const channel = (c: number) => {
            const v = c / 255;
            return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
          };
          return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
        };

        const backgroundOf = (el: Element): [number, number, number] => {
          let node: Element | null = el;
          while (node) {
            const bg = getComputedStyle(node).backgroundColor;
            if (bg && !/rgba\(0, 0, 0, 0\)|transparent/.test(bg)) return parse(bg);
            node = node.parentElement;
          }
          return [255, 255, 255];
        };

        const results: { text: string; ratio: number }[] = [];
        for (const el of Array.from(document.querySelectorAll('body *'))) {
          const text = (el as HTMLElement).innerText?.trim();
          if (!text || el.children.length > 0) continue;

          const style = getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') continue;

          const l1 = luminance(parse(style.color));
          const l2 = luminance(backgroundOf(el));
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          results.push({ text, ratio });
        }
        return results.filter((r) => r.ratio < 4.5);
      });

      expect(failures, `contrast below 4.5:1 in ${scheme} mode: ${JSON.stringify(failures)}`).toEqual([]);
    }
  });
});

test.describe('responsive (DESIGN.md §13)', () => {
  test('renders at 360px without horizontal page scroll', async ({ page }) => {
    await page.goto('/dashboard');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(0);
  });

  test('interactive targets are at least 44px', async ({ page }) => {
    await page.goto('/dashboard');

    const undersized = await page.evaluate(() => {
      const results: { text: string; height: number }[] = [];
      const selector = 'a[href], button, input, select, textarea, [tabindex]';
      for (const el of Array.from(document.querySelectorAll(selector))) {
        const style = getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden') continue;
        // The visually-hidden skip link is exempt: it is not a pointer target
        // while hidden, and it is asserted separately once revealed.
        if (el.classList.contains('sr-only')) continue;

        const rect = el.getBoundingClientRect();
        if (rect.height === 0 && rect.width === 0) continue;
        if (rect.height < 44) {
          results.push({ text: (el as HTMLElement).innerText || el.tagName, height: rect.height });
        }
      }
      return results;
    });

    expect(undersized, `targets below 44px: ${JSON.stringify(undersized)}`).toEqual([]);
  });

  test('the revealed skip link meets the 44px target minimum', async ({ page }) => {
    await page.goto('/dashboard');

    await page.keyboard.press('Tab');

    const box = await page.locator('a[href="#main"]').boundingBox();
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});
