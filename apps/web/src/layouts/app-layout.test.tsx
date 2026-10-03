/**
 * App shell tests.
 *
 * These target the accessibility contract in DESIGN.md §11 and PRD §10.6, which
 * is a requirement rather than a nice-to-have. Copy assertions follow DESIGN.md
 * §12: plain second person, no filler, no exclamation marks.
 *
 * The shell reads the session so it can show the user's name and a sign-out
 * control. `api.me` is stubbed rather than mocked at the module level so the
 * tests exercise the real TanStack Query path, including the "no QueryClient"
 * failure that a missing provider produces.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppLayout } from '../layouts/app-layout';
import * as apiClient from '../lib/api-client';

const signedInUser = { id: 'u1', email: 'sam@example.com', name: 'Sam', createdAt: '2026-01-01' };

function renderShell(initialPath = '/dashboard') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <AppLayout />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

beforeEach(() => {
  vi.spyOn(apiClient.api, 'me').mockResolvedValue({ user: signedInUser });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('AppLayout', () => {
  it('renders the product name and primary navigation', () => {
    renderShell();

    expect(screen.getByText('Tarn')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Primary' })).toBeInTheDocument();
  });

  it('uses semantic landmarks', () => {
    renderShell();

    // DESIGN.md §11: semantic HTML, not a pile of divs.
    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('exposes a working skip-to-content link (DESIGN.md §11)', async () => {
    const user = userEvent.setup();
    renderShell();

    const skip = screen.getByRole('link', { name: /skip to content/i });
    expect(skip).toHaveAttribute('href', '#main');

    // Visually hidden until focused, but always present for keyboard users.
    await user.tab();
    expect(skip).toHaveFocus();
  });

  it('gives every nav item an accessible name', () => {
    renderShell();

    const links = screen.getAllByRole('link');
    for (const link of links) {
      expect(link).toHaveAccessibleName();
    }
  });

  it('marks the active nav link for assistive technology', () => {
    renderShell('/dashboard');

    const link = screen.getByRole('link', { name: 'Dashboard' });
    expect(link).toHaveAttribute('aria-current', 'page');
  });

  it('shows the signed-in user and a sign-out control', async () => {
    renderShell();

    expect(await screen.findByText('Sam')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  // NOTE ON TOUCH TARGETS: there is deliberately no jsdom test asserting a 44px
  // target for the sign-out control. jsdom performs no layout, so the only way to
  // assert it here is to match the Tailwind class name — which tests the styling
  // system's spelling, not the rendered size, and breaks on any refactor. The
  // real check is `tests/e2e/smoke.spec.ts` ("interactive targets are at least
  // 44px"), which measures `getBoundingClientRect()` in a real engine and covers
  // this control among others.

  // A dead "Sign out" button on the sign-in page is a small thing that reads as a
  // bug, so the control is asserted to be absent when there is no session.
  it('hides the sign-out control when signed out', async () => {
    vi.spyOn(apiClient.api, 'me').mockRejectedValue(
      new apiClient.ApiRequestError(401, 'unauthorized', 'Sign in to continue.'),
    );

    renderShell('/login');

    await screen.findByRole('main');
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument();
  });
});
