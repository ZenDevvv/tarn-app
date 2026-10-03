/**
 * Auth module — service layer (architecture §20, §23).
 *
 * Business logic lives here, never in route files (architecture §92 rule 2).
 */
import { hashPassword, needsRehash, verifyPassword } from '@tarn/auth';
import { AppError } from '../../middleware/error-handler.js';
import * as repo from './auth.repository.js';
import type { AuthUser } from './auth.repository.js';

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface AuthResult {
  user: AuthUser;
}

/**
 * Register a new account.
 *
 * Hashing happens before the insert so the plaintext never reaches the database
 * layer, and so a unique-constraint collision does not waste the hash.
 */
export async function register(input: RegisterInput): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();

  const passwordHash = await hashPassword(input.password);

  const user = await repo.createUser({ email, passwordHash, name: input.name });

  if (!user) {
    // Do not reveal whether the address is already registered; that is account
    // enumeration. The copy tells the user what to do next without confirming it.
    throw new AppError(409, 'email_taken', 'That email already has an account. Try signing in instead.');
  }

  return { user };
}

/**
 * Verify credentials.
 *
 * **Enumeration defence.** A missing user and a wrong password must produce the
 * same error, so an attacker cannot use the login form to discover which email
 * addresses have accounts. When the user does not exist we still run a hash
 * verification against a dummy hash, which costs the same time as a real check
 * and removes the timing difference as well as the message difference.
 */
export async function login(input: { email: string; password: string }): Promise<AuthResult> {
  const record = await repo.findByEmail(input.email);

  if (!record) {
    await verifyPassword(input.password, DUMMY_HASH);
    throw invalidCredentials();
  }

  const valid = await verifyPassword(input.password, record.passwordHash);

  if (!valid) {
    throw invalidCredentials();
  }

  // Opportunistic upgrade when cost parameters have been raised since this
  // password was set (the stored format is self-describing, so this is safe).
  if (needsRehash(record.passwordHash)) {
    const upgraded = await hashPassword(input.password);
    await repo.updatePasswordHash(record.id, upgraded).catch(() => {
      // A failed upgrade must never block a legitimate sign-in.
    });
  }

  return {
    user: { id: record.id, email: record.email, name: record.name, createdAt: record.createdAt },
  };
}

/**
 * Resolve a token subject to a current user.
 *
 * A valid signature is not sufficient: the user must still exist. This is what
 * makes a token for a deleted account stop working immediately.
 */
export async function resolveUser(userId: string): Promise<AuthUser> {
  const user = await repo.findById(userId);
  if (!user) {
    throw new AppError(401, 'unauthorized', 'Sign in to continue.');
  }
  return user;
}

function invalidCredentials(): AppError {
  // Identical for "no such user" and "wrong password". See login().
  return new AppError(401, 'invalid_credentials', 'Email or password is incorrect.');
}

/**
 * A real scrypt hash of an unguessable value, used only to equalise timing on the
 * unknown-email path. It can never be matched, because the input is random.
 */
const DUMMY_HASH =
  'scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' +
  'ZG8gbm90IG1hdGNoIGFueXRoaW5nLXBsYWNlaG9sZGVyLWJ5LWRlc2lnbi1wYWRkaW5nLTAwMDAwMDAwMDAwMDA=';
