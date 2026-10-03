/**
 * Session state (architecture §12.1).
 *
 * Server state lives in TanStack Query, never in a client store (architecture §92
 * rules 3 and 4). The session is server state: the cookie is the source of truth
 * and the only way to read it is to ask the API.
 *
 * The session is cached briefly so a client-side navigation does not re-fetch on
 * every render, but a sign-in or sign-out invalidates it immediately.
 */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiRequestError, api, type AuthUser } from './api-client';

export const SESSION_KEY = ['session'] as const;

export interface Credentials {
  email: string;
  password: string;
}

/**
 * The current session.
 *
 * `retry: false` is deliberate: a 401 means "signed out", which is a normal
 * answer, not a transient failure. Retrying it would delay every redirect to the
 * sign-in screen and could hammer the rate limiter.
 */
export function useSession() {
  return useQuery({
    queryKey: SESSION_KEY,
    queryFn: api.me,
    retry: false,
    // Keep the answer briefly; it is not a cache to be trusted long-term because
    // the cookie can change in another tab.
    staleTime: 30_000,
  });
}

export function isUnauthorized(error: unknown): boolean {
  return error instanceof ApiRequestError && error.status === 401;
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Credentials) => api.login(input),
    onSuccess: (data) => {
      queryClient.setQueryData(SESSION_KEY, data);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Credentials & { name: string }) => api.register(input),
    onSuccess: (data) => {
      queryClient.setQueryData(SESSION_KEY, data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.logout(),
    onSuccess: () => {
      queryClient.setQueryData(SESSION_KEY, null);
    },
  });
}

export type { AuthUser };
