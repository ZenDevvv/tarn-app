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
import { Navigate, useLocation } from 'react-router-dom';
import { useSession } from '../../../lib/use-session';

export function RequireAuth({ children }: { children: ReactNode }) {
  const session = useSession();
  const location = useLocation();

  if (session.isPending) {
    return (
      <p className="text-sm text-muted-foreground" aria-live="polite">
        Checking your session…
      </p>
    );
  }

  if (session.isError || !session.data?.user) {
    // Remember where they were headed so sign-in can return them there.
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
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
