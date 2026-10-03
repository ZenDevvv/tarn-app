/**
 * The enumeration-defence dummy hash.
 *
 * This exists because the sign-in path verifies a password against a real hash
 * even when no account exists, so the response time does not reveal whether an
 * address is registered.
 *
 * The test calls the **same exported function** the service uses. An earlier
 * version copied the hash literal into this file, which meant the test could
 * keep passing while the service used a different string — and it could never
 * notice the cost parameters changing. Sharing the implementation is the only
 * way this test can fail when it should.
 */
import { describe, expect, it } from 'vitest';
import { createDummyHash, hashPassword, verifyPassword } from './password.js';

describe('createDummyHash', () => {
  it('produces a hash that parses and can never be matched', async () => {
    const dummy = await createDummyHash();

    // The six-field self-describing format, so verifyPassword takes the full
    // derive-and-compare path rather than bailing out early.
    expect(dummy.split('$')).toHaveLength(6);
    expect(dummy.startsWith('scrypt$')).toBe(true);

    expect(await verifyPassword('anything-at-all', dummy)).toBe(false);
  });

  it('reflects the current cost parameters, so it cannot drift from real hashes', async () => {
    const [dummy] = (await createDummyHash()).split('$');
    const [real] = (await hashPassword('a-real-password')).split('$');
    const [, dummyN, dummyR, dummyP] = (await createDummyHash()).split('$');
    const [, realN, realR, realP] = (await hashPassword('a-real-password')).split('$');

    expect(dummy).toBe(real);
    expect(dummyN).toBe(realN);
    expect(dummyR).toBe(realR);
    expect(dummyP).toBe(realP);
  });

  it('is unguessable: two calls produce different hashes', async () => {
    // If these were equal, the "random" plaintext would be fixed and could
    // eventually be guessed by brute force.
    expect(await createDummyHash()).not.toBe(await createDummyHash());
  });
});
