/**
 * Smoke and accessibility tests.
 *
 * These cover what exists today: the app shell and the API health wiring.
 * They do **not** cover register/login/create-application, because those
 * features are not built (architecture §62 lists them as the target E2E suite,
 * not as a current one).
 *
 * Accessibility assertions follow DESIGN.md §11, which jsdom cannot verify:
 * real contrast, focus order, and touch-target size need a browser engine.
 */
import { expect, test } from '@playwright/test';

test.describe('app shell', () => {
  test('redirects the root path to the dashboard', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveURL(/\/dashboard$/);
  });

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
  });

  test('every interactive control has an accessible name', async ({ page }) => {
    await page.goto('/dashboard');

    const unnamed = await page.evaluate(() => {
      const controls = Array.from(
        document.querySelectorAll<HTMLElement>('a[href], button, input, select, textarea'),
      );
      return controls.filter((el) => {
        const name =
          el.getAttribute('aria-label') ?? el.getAttribute('title') ?? el.textContent?.trim() ?? '';
        return name.length === 0;
      }).length;
    });

    expect(unnamed).toBe(0);
  });

  test('body text meets 4.5:1 contrast in both themes', async ({ page }) => {
    await page.goto('/dashboard');

    // The light theme is the default; the dark class is toggled by the token
    // layer, so both are checked explicitly.
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });

      const failing = await page.evaluate(() => {
        const parse = (value: string): number[] => {
          const match = value.match(/\d+(\.\d+)?/g);
          return match ? match.slice(0, 3).map(Number) : [0, 0, 0];
        };
        const luminance = (rgb: number[]): number => {
          const [r, g, b] = rgb.map((v) => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
          });
          return 0.2126 * (r as number) + 0.7152 * (g as number) + 0.0722 * (b as number);
        };

        const results: { text: string; ratio: number }[] = [];
        const elements = Array.from(document.querySelectorAll<HTMLElement>('p, h1, h2, a, span, li'));

        for (const el of elements) {
          if (!el.textContent?.trim()) continue;
          const style = getComputedStyle(el);
          const fg = parse(style.color);
          // Walk up for the first non-transparent background.
          let node: HTMLElement | null = el;
          let bg = [255, 255, 255];
          while (node) {
            const candidate = parse(getComputedStyle(node).backgroundColor);
            if (candidate.some((v) => v > 0)) {
              bg = candidate;
              break;
            }
            node = node.parentElement;
          }
          const l1 = luminance(fg);
          const l2 = luminance(bg);
          const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
          results.push({ text: el.textContent.trim().slice(0, 40), ratio });
        }
        return results;
      });

      const below = failing.filter((r) => r.ratio < 4.5);
      expect(below, `contrast below 4.5:1 in ${scheme} mode: ${JSON.stringify(below)}`).toEqual([]);
    }
  });
});

test.describe('responsive (DESIGN.md §13)', () => {
  test('renders at 360px without horizontal page scroll', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/dashboard');

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );

    // The page itself must never scroll sideways.
    expect(overflow).toBeLessThanOrEqual(1);
  });

  test('interactive targets are at least 44px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/dashboard');

    const tooSmall = await page.evaluate(() => {
      // Elements clipped to 1x1 by `sr-only` are not pointer-reachable while
      // hidden, so they are out of scope for a pointer-target check. The skip
      // link is asserted separately, in its focused state, by the next test.
      const isVisuallyHidden = (el: HTMLElement): boolean => {
        const rect = el.getBoundingClientRect();
        return rect.width <= 1 && rect.height <= 1;
      };

      const targets = Array.from(
        document.querySelectorAll<HTMLElement>('a[href], button, input, select'),
      ).filter((el) => el.offsetParent !== null && !isVisuallyHidden(el));

      return targets
        .map((el) => {
          const rect = el.getBoundingClientRect();
          return {
            name: el.textContent?.trim() || el.tagName,
            width: Math.round(rect.width),
            height: Math.round(rect.height),
          };
        })
        .filter((t) => t.height > 0 && t.height < 44)
        .map((t) => `${t.name} ${t.width}x${t.height}`);
    });

    // DESIGN.md §11 states a 44px minimum with no exemption for nav links.
    // An earlier version of this test logged undersized targets instead of
    // failing, which hid a real violation in the primary navigation.
    expect(tooSmall, `targets under 44px: ${tooSmall.join(', ')}`).toEqual([]);
  });

  test('the revealed skip link meets the 44px target minimum', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 });
    await page.goto('/dashboard');

    const skip = page.getByRole('link', { name: /skip to content/i });
    await skip.focus();

    const box = await skip.boundingBox();
    expect(box, 'skip link should be visible once focused').not.toBeNull();
    // A hidden-then-revealed control is only usable if it is big enough once shown.
    expect(box?.height ?? 0).toBeGreaterThanOrEqual(44);
  });
});
