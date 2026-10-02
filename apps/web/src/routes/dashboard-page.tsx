/**
 * Dashboard placeholder (PRD §7.2).
 *
 * Real dashboard metrics land in architecture §90 Step 7. This page exists to
 * prove the shell, routing and API wiring work.
 *
 * Copy follows DESIGN.md §12: empty states invite an action, plain
 * second person, no filler and no exclamation marks.
 */
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api-client';

export function DashboardPage() {
  const health = useQuery({
    queryKey: ['health'],
    queryFn: api.health,
    retry: 0,
  });

  return (
    <section aria-labelledby="dashboard-heading">
      <h1 id="dashboard-heading" className="text-2xl font-semibold">
        Dashboard
      </h1>

      <p className="mt-2 text-muted-foreground">
        Your applications, follow-ups and pipeline will appear here.
      </p>

      <div className="mt-6 rounded border border-border bg-card p-4">
        <h2 className="text-sm text-muted-foreground">API status</h2>
        {health.isPending && <p className="mt-1 text-sm">Checking the API…</p>}
        {health.isError && (
          <p className="mt-1 text-sm">
            Could not reach the API. Start it with{' '}
            <code className="font-mono">pnpm --filter @tarn/api dev</code>.
          </p>
        )}
        {health.isSuccess && (
          <p className="mt-1 text-sm" aria-live="polite">
            Connected to {health.data.service}.
          </p>
        )}
      </div>

      <div className="mt-6 rounded border border-border bg-card p-6">
        <h2 className="text-sm text-muted-foreground">No applications yet</h2>
        <p className="mt-1">
          Add your first one to start tracking. Application entry arrives with the applications module.
        </p>
      </div>
    </section>
  );
}
