/**
 * Query client defaults (architecture §13-§15).
 *
 * TanStack Query owns server state only. Local UI state uses React state —
 * do not mirror API data into component state (architecture §92 rule 3).
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/** Query key factory — keeps keys consistent and invalidation predictable. */
export const queryKeys = {
  health: ['health'] as const,
  applications: (filters?: Record<string, unknown>) => ['applications', filters ?? {}] as const,
  application: (id: string) => ['applications', id] as const,
  companies: () => ['companies'] as const,
  jobs: () => ['jobs'] as const,
  savedJobs: () => ['saved-jobs'] as const,
  skills: () => ['skills'] as const,
  offers: () => ['offers'] as const,
  followUps: () => ['follow-ups'] as const,
};