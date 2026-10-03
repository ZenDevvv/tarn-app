/**
 * Registration page (PRD §7.1 FR-AUTH-001).
 */
import { Link, useNavigate } from 'react-router-dom';
import { ApiRequestError } from '../lib/api-client';
import { useRegister } from '../lib/use-session';
import { AuthForm } from '../features/auth/components/auth-form';

export function RegisterPage() {
  const register = useRegister();
  const navigate = useNavigate();

  const errorMessage =
    register.error instanceof ApiRequestError
      ? register.error.message
      : register.error
        ? 'Could not create your account. Try again.'
        : null;

  return (
    <section aria-labelledby="register-heading" className="mx-auto max-w-sm">
      <h1 id="register-heading" className="text-2xl font-semibold">
        Create your account
      </h1>

      <AuthForm
        submitLabel="Create account"
        busyLabel="Creating your account…"
        pending={register.isPending}
        error={errorMessage}
        fieldErrors={register.error instanceof ApiRequestError ? register.error.fields : undefined}
        includeName
        onSubmit={async ({ name, email, password }) => {
          // The form always renders a name field here, so this is never actually
          // empty; the API rejects an empty name with a field message either way.
          await register.mutateAsync({ name: name ?? '', email, password });
          navigate('/dashboard', { replace: true });
        }}
      />

      <p className="mt-6 text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="underline underline-offset-4">
          Sign in
        </Link>
      </p>
    </section>
  );
}
