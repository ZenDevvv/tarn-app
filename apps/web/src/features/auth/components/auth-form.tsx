/**
 * Shared email/password form for sign-in and registration.
 *
 * Accessibility is not optional here (DESIGN.md §11):
 *   - every input has a real `<label htmlFor>`, not a placeholder;
 *   - errors are announced via `role="alert"` and wired with `aria-describedby`;
 *   - fields the API rejected are marked `aria-invalid`;
 *   - controls are at least 44px tall, the touch-target minimum;
 *   - the submit button keeps a stable label so its width does not shift.
 *
 * Tokens only (DESIGN.md §1): no hard-coded colours.
 */
import { useId, useState, type FormEvent } from 'react';

export interface AuthFormValues {
  /** Absent on the sign-in form, which has no name field. */
  name?: string | undefined;
  email: string;
  password: string;
}

interface AuthFormProps {
  submitLabel: string;
  busyLabel: string;
  pending: boolean;
  error: string | null;
  /** Per-field messages from the API's 422 response, keyed by field name. */
  fieldErrors?: Record<string, string>;
  includeName?: boolean;
  onSubmit: (values: AuthFormValues) => Promise<void> | void;
}

export function AuthForm({
  submitLabel,
  busyLabel,
  pending,
  error,
  fieldErrors = {},
  includeName = false,
  onSubmit,
}: AuthFormProps) {
  const id = useId();
  const [values, setValues] = useState({ name: '', email: '', password: '' });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      await onSubmit(includeName ? values : { email: values.email, password: values.password });
    } catch {
      // Deliberately swallowed. The parent surfaces the failure through the
      // mutation's `error` state, which this form renders. Letting the rejection
      // escape here produces an unhandled promise rejection *and* leaves the
      // pending button stuck, because nothing ever re-enables it.
    }
  }

  /** Wire a field's error message to its input for screen readers. */
  function describedBy(field: string): string | undefined {
    return fieldErrors[field] ? `${id}-${field}-error` : undefined;
  }

  function fieldError(field: string): string {
    return fieldErrors[field] ?? '';
  }

  const inputClass =
    // min-h-11 gives the 44px touch target (DESIGN.md §11).
    'mt-1 block w-full min-h-11 rounded border border-border bg-background px-3 py-2';

  return (
    <form className="mt-6 space-y-4" onSubmit={handleSubmit} noValidate>
      {includeName && (
        <div>
          <label htmlFor={`${id}-name`} className="block text-sm font-medium">
            Name
          </label>
          <input
            id={`${id}-name`}
            name="name"
            autoComplete="name"
            required
            value={values.name}
            onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
            className={inputClass}
            aria-invalid={Boolean(fieldError('name'))}
            aria-describedby={describedBy('name')}
          />
          {fieldError('name') && (
            <p id={`${id}-name-error`} className="mt-1 text-sm">
              {fieldError('name')}
            </p>
          )}
        </div>
      )}

      <div>
        <label htmlFor={`${id}-email`} className="block text-sm font-medium">
          Email
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
          className={inputClass}
          aria-invalid={Boolean(fieldError('email'))}
          aria-describedby={describedBy('email')}
        />
        {fieldError('email') && (
          <p id={`${id}-email-error`} className="mt-1 text-sm">
            {fieldError('email')}
          </p>
        )}
      </div>

      <div>
        <label htmlFor={`${id}-password`} className="block text-sm font-medium">
          Password
        </label>
        <input
          id={`${id}-password`}
          name="password"
          type="password"
          autoComplete={includeName ? 'new-password' : 'current-password'}
          required
          value={values.password}
          onChange={(e) => setValues((v) => ({ ...v, password: e.target.value }))}
          className={inputClass}
          aria-invalid={Boolean(fieldError('password'))}
          aria-describedby={describedBy('password')}
        />
        {fieldError('password') ? (
          <p id={`${id}-password-error`} className="mt-1 text-sm">
            {fieldError('password')}
          </p>
        ) : (
          includeName && <p className="mt-1 text-sm text-muted-foreground">At least 8 characters.</p>
        )}
      </div>

      {error && (
        <p role="alert" className="rounded border border-border bg-card p-3 text-sm">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-11 w-full items-center justify-center rounded bg-foreground px-4 py-2 font-medium text-background disabled:opacity-60"
      >
        {pending ? busyLabel : submitLabel}
      </button>
    </form>
  );
}
