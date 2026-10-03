/**
 * Auth module — repository layer (architecture §20).
 *
 * Prisma is confined to this file. No controller or service calls the client
 * directly (architecture §92 rule 1).
 */
import { prisma } from '@tarn/database';

/** The user shape the auth module needs. Never returns `passwordHash` outward. */
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

/** Internal row, including the hash. Only the service may read this. */
export interface UserWithHash extends AuthUser {
  passwordHash: string;
}

/**
 * Look up by email for the login path.
 *
 * `normalizeEmail` must match the transform in `registerSchema` (lowercase +
 * trim), otherwise an account registered as `A@B.com` would be unreachable by
 * the address actually typed at login.
 */
export async function findByEmail(email: string): Promise<UserWithHash | null> {
  return prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
    select: { id: true, email: true, name: true, createdAt: true, passwordHash: true },
  });
}

export async function findById(id: string): Promise<AuthUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: { id: true, email: true, name: true, createdAt: true },
  });
}

/**
 * Create a user.
 *
 * Returns null when the email is already taken, so the service can produce the
 * correct conflict response without leaking whether the address exists.
 */
export async function createUser(input: {
  email: string;
  passwordHash: string;
  name: string;
}): Promise<AuthUser | null> {
  try {
    return await prisma.user.create({
      data: {
        email: input.email.trim().toLowerCase(),
        passwordHash: input.passwordHash,
        name: input.name.trim(),
      },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  } catch (error) {
    // Prisma P2002 = unique constraint violation. Anything else is a real fault
    // and must propagate rather than be reported as "email taken".
    if (typeof error === 'object' && error !== null && (error as { code?: string }).code === 'P2002') {
      return null;
    }
    throw error;
  }
}

/** True when a user with this id exists. Guards against tokens for deleted users. */
export async function existsById(id: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  return user !== null;
}

/**
 * Replace a stored hash, used only by the opportunistic rehash on login.
 *
 * Deliberately returns void and swallows nothing: the caller decides whether a
 * failure matters, because a failed upgrade must never block a valid sign-in.
 */
export async function updatePasswordHash(userId: string, passwordHash: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });
}

/** Test seam. */
export function __getPrisma() {
  return prisma;
}
