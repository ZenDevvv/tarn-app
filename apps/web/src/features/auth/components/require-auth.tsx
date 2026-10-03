/**
 * Route guard for authenticated pages (architecture §36, PRD §33).
 *
 * This is a **convenience redirect, not a security control.** The API enforces
 * authorization server-side; a client-side guard only avoids showing a shell the
 * user cannot populate. Removing it would leak no data.
 *
 * It waits for the session query to settle before deciding, because redirecting
 * during the pending state would bounce a signed-in user to the sign-in page on
 * every refresh.
 */
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useSession } from '../../../lib/use-session';

export function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session.isPending) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Checking your session…
      </p>
    );
  }

  if (session.isError || !session.data?.user) {
    // No `state.from` is passed. It was previously set here and never read by the
    // login page, so it was dead code implying a redirect-back that did not
    // exist. `/dashboard` is currently the only protected route, so returning
    // there after sign-in is the same destination anyway. If deep-linking to
    // specific pages lands later, this is where the return path should be wired.
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

/**
 * Keeps a signed-in user off the sign-in and registration pages.
 *
 * Without this, signing in and then hitting /login again shows a form for an
 * account you already have.
 */
export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const session = useSession();

  if (session.isPending) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Checking your session…
      </p>
    );
  }

  if (session.data?.user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
