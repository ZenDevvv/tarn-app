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

export async function apiFetch<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${baseUrl}${path}`, {
    // Send the httpOnly session cookie (architecture §2.2, §55).
    credentials: 'include',
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
    ...init,
  });

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
