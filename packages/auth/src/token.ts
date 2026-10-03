/**
 * Session tokens (architecture §37, §38, §55; D-0002).
 *
 * ## Model
 *
 * Two token kinds, both carried in httpOnly cookies and never in JS storage
 * (architecture §37 explicitly rules out localStorage/sessionStorage):
 *
 *   - **access**  — short-lived (~15 min), sent on every request, proves identity.
 *   - **refresh** — long-lived (~7 days), used only to mint new access tokens.
 *
 * ## Why two, and why not revocable
 *
 * `users` is the only auth-related table in the MVP schema, and
 * `packages/database/prisma/schema.test.ts` asserts the exact model set. Adding a
 * `sessions` table would have failed that guard, which exists to enforce D-0004
 * scope. Server-side revocation was therefore explicitly declined by the owner on
 * 2026-10-03 in favour of stateless tokens.
 *
 * **The accepted trade-off, stated plainly:** logout clears the cookie, but a
 * token that has already been issued remains valid until it expires. This is the
 * genuine cost of the decision and must not be described as "sessions are
 * revocable". It is bounded by the short access-token life; the refresh token is
 * the long-lived exposure, and rotating it does not retroactively invalidate a
 * copy already taken.
 *
 * To make sessions revocable later, the change is: add a `sessions` table, store a
 * token id in the JWT, check it on refresh, and delete the row on logout. The
 * signing/verification code below does not need to change.
 *
 * ## Algorithm
 *
 * HS256 with `JWT_SECRET`. Symmetric because a single service both issues and
 * verifies; a second service would need RS256/EdDSA so it could verify without
 * holding the signing key. Not a decision that can be deferred if the API ever
 * splits — recorded here so it is made deliberately.
 *
 * `jose` is used rather than hand-rolling HMAC signing: JWT construction is
 * security-critical, and a library with test vectors is safer than bespoke code
 * (architecture §92 rule 11 — a real requirement justifies the dependency).
 */
import { randomBytes } from 'node:crypto';
import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

const ALGORITHM = 'HS256';

/** Token kinds. Kept in a claim so an access token can never be used to refresh. */
export type TokenKind = 'access' | 'refresh';

export interface TokenPayload extends JWTPayload {
  sub: string;
  kind: TokenKind;
}

/**
 * Lifetimes.
 *
 * Access is short because it is the token most likely to leak through logs or a
 * proxy, and because every protected request re-verifies it.
 */
export const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
export const REFRESH_TOKEN_TTL_SECONDS = 7 * 24 * 60 * 60;

/** Claim name carrying the token kind. `typ` is reserved by RFC 7519. */
const KIND_CLAIM = 'kind';

function secretKey(secret: string): Uint8Array {
  // HS256 requires >= 256 bits. Fail loudly rather than sign with a weak key.
  if (typeof secret !== 'string' || secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters. Generate one with: openssl rand -base64 48');
  }
  return new TextEncoder().encode(secret);
}

/**
 * Unique token id.
 *
 * Without this, two tokens minted for the same user inside the same second have
 * identical claims and therefore an **identical signature** — so "rotate the
 * refresh token" would reissue the exact same string and rotation would be
 * theatre. A random `jti` makes every issued token distinct.
 *
 * It also gives a future revocable-session table (see the trade-off note above)
 * a primary key to store, so that migration does not need a second token format.
 */
function tokenId(): string {
  return randomBytes(16).toString('hex');
}

async function signToken(
  userId: string,
  kind: TokenKind,
  secret: string,
  ttlSeconds: number,
): Promise<string> {
  return new SignJWT({ [KIND_CLAIM]: kind })
    .setProtectedHeader({ alg: ALGORITHM, typ: 'JWT' })
    .setSubject(userId)
    .setJti(tokenId())
    .setIssuedAt()
    .setExpirationTime(`${ttlSeconds}s`)
    .sign(secretKey(secret));
}

export function signAccessToken(userId: string, secret: string): Promise<string> {
  return signToken(userId, 'access', secret, ACCESS_TOKEN_TTL_SECONDS);
}

export function signRefreshToken(userId: string, secret: string): Promise<string> {
  return signToken(userId, 'refresh', secret, REFRESH_TOKEN_TTL_SECONDS);
}

/**
 * Verify a token and return its claims.
 *
 * Returns null on any failure — bad signature, expired, wrong algorithm, missing
 * subject, or a token whose `kind` is not the one asked for. Callers get one
 * failure path, and no error message leaks which check failed.
 *
 * The `kind` check is what stops a refresh token being presented as an access
 * token to `requireAuth`, which would otherwise double its effective lifetime.
 */
export async function verifyToken(
  token: string,
  secret: string,
  expectedKind: TokenKind,
): Promise<TokenPayload | null> {
  if (typeof token !== 'string' || token.length === 0) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey(secret), {
      algorithms: [ALGORITHM],
    });

    if (typeof payload.sub !== 'string' || payload.sub.length === 0) return null;
    if (payload[KIND_CLAIM] !== expectedKind) return null;

    return { ...payload, sub: payload.sub, kind: expectedKind };
  } catch {
    return null;
  }
}
