/**
 * API client (architecture §17).
 *
 * Public config only — never a secret (architecture §56). Credentials are sent
 * as cookies so the token never reaches JS.
 */
const baseUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:4000/api/v1';

export class ApiRequestError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields: Record<string, string>;

  constructor(status: number, code: string, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiRequestError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

/**
 * Single in-flight refresh, shared by every concurrent 401.
 *
 * Without this, a page that fires five requests when its access token expires
 * would send five refresh calls. The API would honour all five, and four would be
 * wasted round trips that also burn the login rate limiter's budget.
 */
let refreshInFlight: Promise<boolean> | null = null;

async function refreshSession(): Promise<boolean> {
  refreshInFlight ??= (async () => {
    try {
      const response = await fetch(`${baseUrl}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'content-type': 'application/json' },
      });
      return response.ok;
    } catch {
      return false;
    } finally {
      // Cleared so a later expiry can try again.
      refreshInFlight = null;
    }
  })();

  return refreshInFlight;
}

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const send = () =>
    fetch(`${baseUrl}${path}`, {
      // Send the httpOnly session cookie (architecture §2.2, §55).
      credentials: 'include',
      headers: {
        'content-type': 'application/json',
        ...init.headers,
      },
      ...init,
    });

  let response = await send();

  /**
   * Transparent session refresh (architecture §38).
   *
   * The access token is deliberately short-lived, so an open tab will hit a 401
   * every 15 minutes. Without this, the user is silently signed out of a session
   * they never asked to end — caught in review.
   *
   * **Which paths are excluded, and why the distinction matters:**
   *
   * - `/auth/login` — a 401 means the *credentials were wrong*. Refreshing and
   *   replaying would spend a round trip and burn rate-limit budget to be told
   *   the same thing twice. An expired token is not what a failed sign-in means.
   * - `/auth/refresh` — retrying it would loop forever.
   *
   * **`/auth/me` is deliberately NOT excluded.** A 401 there usually means the
   * access token expired while the 7-day refresh token is still valid — a user
   * returning after twenty minutes has a perfectly good session and must not be
   * bounced to the sign-in page. This is the same defect as the 15-minute logout,
   * one step later. Exactly one replay is attempted, so there is no loop.
   */
  const canRefresh = !path.startsWith('/auth/login') && !path.startsWith('/auth/refresh');

  if (response.status === 401 && canRefresh) {
    const refreshed = await refreshSession();

    if (refreshed) {
      response = await send();
    }
  }

  const payload = (await response.json().catch(() => null)) as {
    data?: T;
    error?: { code: string; message: string; fields?: Record<string, string> };
  } | null;

  if (!response.ok) {
    throw new ApiRequestError(
      response.status,
      payload?.error?.code ?? 'unknown_error',
      payload?.error?.message ?? 'Something went wrong. Try again.',
      payload?.error?.fields,
    );
  }

  return payload?.data as T;
}

/** The signed-in user. Mirrors the API's public user shape. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export const api = {
  baseUrl,
  health: () => apiFetch<{ status: string; service: string }>('/health'),

  /**
   * Auth calls (architecture §38).
   *
   * Tokens are httpOnly cookies, so there is nothing to store on the client and
   * nothing to attach by hand — `apiFetch` already sends `credentials: 'include'`
   * (architecture §37: never localStorage/sessionStorage).
   */
  register: (input: { email: string; password: string; name: string }) =>
    apiFetch<{ user: AuthUser }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  login: (input: { email: string; password: string }) =>
    apiFetch<{ user: AuthUser }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(input),
    }),

  logout: () => apiFetch<{ signedOut: boolean }>('/auth/logout', { method: 'POST' }),

  /**
   * Current user. Rejects with 401 when signed out, which the session query
   * treats as "no session" rather than as an error worth showing.
   */
  me: () => apiFetch<{ user: AuthUser }>('/auth/me'),
};
