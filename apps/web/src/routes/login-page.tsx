/**
 * Sign-in page (PRD §7.1 FR-AUTH-002).
 *
 * Copy follows DESIGN.md §12: state what happened and what to do. Never reveal
 * whether an email has an account — the API answers identically either way, and
 * the UI must not undo that.
 */
import { Link, useNavigate } from 'react-router-dom';
import { ApiRequestError } from '../lib/api-client';
import { useLogin } from '../lib/use-session';
import { AuthForm } from '../features/auth/components/auth-form';

export function LoginPage() {
  const login = useLogin();
  const navigate = useNavigate();

  // A 429 carries a Retry-After; the API message already says what to do.
  const errorMessage =
    login.error instanceof ApiRequestError
      ? login.error.message
      : login.error
        ? 'Could not sign in. Try again.'
        : null;

  return (
    <section aria-labelledby="login-heading" className="mx-auto max-w-sm">
      <h1 id="login-heading" className="text-2xl font-semibold">
        Sign in
      </h1>

      <AuthForm
        submitLabel="Sign in"
        busyLabel="Signing in…"
        pending={login.isPending}
        error={errorMessage}
        onSubmit={async ({ email, password }) => {
          await login.mutateAsync({ email, password });
          navigate('/dashboard', { replace: true });
        }}
      />

      <p className="mt-6 text-sm text-muted-foreground">
        New here?{' '}
        <Link to="/register" className="underline underline-offset-4">
          Create an account
        </Link>
      </p>
    </section>
  );
}
