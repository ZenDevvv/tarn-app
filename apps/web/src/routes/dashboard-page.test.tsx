/**
 * Dashboard page tests.
 *
 * Covers the API-connection states, because this is the first place a developer
 * sees whether the frontend and backend are wired together. Error and empty
 * copy follows DESIGN.md §12: state what happened and what to do, never
 * apologise, never an exclamation mark.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { DashboardPage } from './dashboard-page';

function renderPage() {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: 0 } },
  });

  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter>
        <DashboardPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

const healthPayload = { data: { status: 'ok', service: 'tarn-api' } };

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows the empty state that invites an action (DESIGN.md §12)', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(healthPayload), { status: 200 }));

    renderPage();

    expect(screen.getByRole('heading', { name: 'Dashboard' })).toBeInTheDocument();
    expect(screen.getByText(/no applications yet/i)).toBeInTheDocument();
    expect(screen.getByText(/add your first one/i)).toBeInTheDocument();
  });

  it('confirms the API connection once health responds', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(healthPayload), { status: 200 }));

    renderPage();

    await waitFor(() => expect(screen.getByText(/connected to tarn-api/i)).toBeInTheDocument());
  });

  it('tells the user how to start the API when it is unreachable', async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ error: { code: 'x', message: 'nope' } }), { status: 500 }),
    );

    renderPage();

    await waitFor(() => expect(screen.getByText(/could not reach the api/i)).toBeInTheDocument());
    // Actionable, not apologetic (DESIGN.md §12).
    expect(screen.getByText(/pnpm --filter @tarn\/api dev/)).toBeInTheDocument();
  });

  it('announces dynamic updates politely rather than assertively (DESIGN.md §11)', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(healthPayload), { status: 200 }));

    const { container } = renderPage();

    await waitFor(() => expect(screen.getByText(/connected to/i)).toBeInTheDocument());

    const liveRegion = container.querySelector('[aria-live]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion?.getAttribute('aria-live')).toBe('polite');
  });

  it('uses no exclamation marks in UI copy (DESIGN.md §12)', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify(healthPayload), { status: 200 }));

    const { container } = renderPage();
    await waitFor(() => expect(screen.getByText(/connected to/i)).toBeInTheDocument());

    expect(container.textContent).not.toContain('!');
  });
});