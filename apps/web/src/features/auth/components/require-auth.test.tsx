/**
 * Route-guard and auth-page tests.
 *
 * The guard is a convenience redirect, not a security control — the API enforces
 * authorization server-side. What these tests protect is the *user experience*:
 * a signed-out visitor must not be shown an empty authenticated shell, and a
 * signed-in user must not be dumped on the sign-in form.
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LoginPage } from '../../../routes/login-page';
import { RegisterPage } from '../../../routes/register-page';
import { RedirectIfAuthed, RequireAuth } from './require-auth';
import * as apiClient from '../../../lib/api-client';

const USER = { id: 'u1', email: 'sam@example.com', name: 'Sam', createdAt: '2026-01-01' };

/**
 * Renders the guards.
 *
 * There is no `data-testid` path probe. Asserting on one couples the test to a
 * test-only element in the tree and lets it pass even if the router never moved —
 * the probe renders at the original path too. Instead each test waits for the
 * *destination content*, which only exists if navigation actually happened.
 */
function renderAt(initialPath: string) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

  function Protected() {
    return (
      <RequireAuth>
        <p>Secret dashboard</p>
      </RequireAuth>
    );
  }

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/dashboard" element={<Protected />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuthed>
                <LoginPage />
              </RedirectIfAuthed>
            }
          />
          <Route
            path="/register"
            element={
              <RedirectIfAuthed>
                <RegisterPage />
              </RedirectIfAuthed>
            }
          />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>,
  );
}

function signedOut() {
  vi.spyOn(apiClient.api, 'me').mockRejectedValue(
    new apiClient.ApiRequestError(401, 'unauthorized', 'Sign in to continue.'),
  );
}

function signedIn() {
  vi.spyOn(apiClient.api, 'me').mockResolvedValue({ user: USER });
}

beforeEach(() => {
  vi.spyOn(apiClient.api, 'login').mockResolvedValue({ user: USER });
  vi.spyOn(apiClient.api, 'register').mockResolvedValue({ user: USER });
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('RequireAuth', () => {
  it('sends a signed-out visitor to the sign-in page', async () => {
    signedOut();
    renderAt('/dashboard');

    // The sign-in form only renders at /login, so its presence is the proof of
    // navigation — no test-only probe needed.
    await screen.findByRole('heading', { name: 'Sign in' });

    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument();
  });

  it('does not flash the protected page while the session is still loading', () => {
    signedIn();
    renderAt('/dashboard');

    // The guard must wait rather than redirect on a pending query.
    expect(screen.queryByText('Secret dashboard')).not.toBeInTheDocument();
    expect(screen.getByText(/checking your session/i)).toBeInTheDocument();
  });

  it('shows the protected page once the session resolves', async () => {
    signedIn();
    renderAt('/dashboard');

    expect(await screen.findByText('Secret dashboard')).toBeInTheDocument();
  });
});

describe('RedirectIfAuthed', () => {
  it('keeps a signed-in user off the sign-in page', async () => {
    signedIn();
    renderAt('/login');

    // The protected page appearing *is* the signal that the redirect happened.
    await screen.findByText('Secret dashboard');

    expect(screen.queryByRole('heading', { name: 'Sign in' })).not.toBeInTheDocument();
  });

  it('shows the sign-in page to a signed-out visitor', async () => {
    signedOut();
    renderAt('/login');

    expect(await screen.findByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });
});

describe('LoginPage', () => {
  it('labels every field for screen readers (DESIGN.md §11)', async () => {
    signedOut();
    renderAt('/login');

    expect(await screen.findByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    // The registration form has a name field; sign-in must not.
    expect(screen.queryByLabelText('Name')).not.toBeInTheDocument();
  });

  it('submits credentials and reaches the dashboard', async () => {
    signedOut();
    const user = userEvent.setup();
    renderAt('/login');

    await user.type(await screen.findByLabelText('Email'), 'sam@example.com');
    await user.type(screen.getByLabelText('Password'), 'correct-horse-battery');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(apiClient.api.login).toHaveBeenCalledWith({
      email: 'sam@example.com',
      password: 'correct-horse-battery',
    });

    // The protected page only renders at /dashboard, so its presence is the proof
    // the navigation happened.
    expect(await screen.findByText('Secret dashboard')).toBeInTheDocument();
  });

  it('announces a failure and keeps the user on the form', async () => {
    signedOut();
    vi.spyOn(apiClient.api, 'login').mockRejectedValue(
      new apiClient.ApiRequestError(401, 'invalid_credentials', 'Email or password is incorrect.'),
    );
    const user = userEvent.setup();
    renderAt('/login');

    await user.type(await screen.findByLabelText('Email'), 'sam@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    // role="alert" so assistive tech announces it.
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Email or password is incorrect.');
    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('surfaces a rate-limit message verbatim', async () => {
    signedOut();
    vi.spyOn(apiClient.api, 'login').mockRejectedValue(
      new apiClient.ApiRequestError(429, 'login_rate_limited', 'Too many sign-in attempts.'),
    );
    const user = userEvent.setup();
    renderAt('/login');

    await user.type(await screen.findByLabelText('Email'), 'sam@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Too many sign-in attempts.');
  });

  it('offers a route to registration', async () => {
    signedOut();
    renderAt('/login');

    expect(await screen.findByRole('link', { name: /create an account/i })).toBeInTheDocument();
  });
});

describe('RegisterPage', () => {
  it('includes a name field and explains the password rule', async () => {
    signedOut();
    renderAt('/register');

    expect(await screen.findByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByText(/at least 8 characters/i)).toBeInTheDocument();
  });

  it('marks the password field for new credentials', async () => {
    signedOut();
    renderAt('/register');

    await screen.findByLabelText('Name');
    expect(screen.getByLabelText('Password')).toHaveAttribute('autocomplete', 'new-password');
  });

  it('submits the new account', async () => {
    signedOut();
    const user = userEvent.setup();
    renderAt('/register');

    await user.type(await screen.findByLabelText('Name'), 'Sam');
    await user.type(screen.getByLabelText('Email'), 'sam@example.com');
    await user.type(screen.getByLabelText('Password'), 'correct-horse-battery');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(apiClient.api.register).toHaveBeenCalledWith({
      name: 'Sam',
      email: 'sam@example.com',
      password: 'correct-horse-battery',
    });
  });

  it('shows per-field validation messages from the API', async () => {
    signedOut();
    vi.spyOn(apiClient.api, 'register').mockRejectedValue(
      new apiClient.ApiRequestError(422, 'validation_failed', 'Some fields need another look.', {
        email: 'Enter an email address, like you@example.com.',
      }),
    );
    const user = userEvent.setup();
    renderAt('/register');

    await user.type(await screen.findByLabelText('Name'), 'Sam');
    await user.type(screen.getByLabelText('Email'), 'nope');
    await user.type(screen.getByLabelText('Password'), 'short');
    await user.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Enter an email address, like you@example.com.')).toBeInTheDocument();
    // aria-invalid wires the message to the input.
    expect(screen.getByLabelText('Email')).toHaveAttribute('aria-invalid', 'true');
  });
});
