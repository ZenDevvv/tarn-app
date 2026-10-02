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

export const api = {
  baseUrl,
  health: () => apiFetch<{ status: string; service: string }>('/health'),
};
