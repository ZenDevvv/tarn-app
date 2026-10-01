/**
 * Password hashing tests.
 *
 * These replace the `sha256:<hex>` placeholder the scaffold originally shipped
 * in the development seed. That placeholder was not a password hashing scheme:
 * a single SHA-256 is fast enough to brute-force offline. `.wwg/wiki/project-truth.md`
 * records the swap to scrypt.
 *
 * `.wwg/governance/test-enforcement.md` rule 4 treats auth as approval-sensitive,
 * so the security-relevant properties are pinned here rather than assumed.
 */
import { describe, expect, it } from 'vitest';
import { hashPassword, needsRehash, verifyPassword } from './password.js';

// Note: scrypt at production cost is intentionally slow (~50-100 ms per call).
// These tests perform many hashes, so the suite takes a few seconds by design.

describe('hashPassword', () => {
  it('produces a self-describing scrypt string', async () => {
    const stored = await hashPassword('correct horse battery staple');
    const parts = stored.split('$');

    expect(parts).toHaveLength(6);
    expect(parts[0]).toBe('scrypt');
    expect(Number(parts[1])).toBeGreaterThanOrEqual(2);
    expect(parts[5]).not.toHaveLength(0);
  });

  it('never embeds the plaintext password', async () => {
    const stored = await hashPassword('super-secret-value');
    expect(stored).not.toContain('super-secret-value');
  });

  it('is salted: two hashes of the same password differ', async () => {
    const a = await hashPassword('same-password');
    const b = await hashPassword('same-password');

    expect(a).not.toBe(b);
    // Same cost parameters, different salt.
    expect(a.split('$').slice(0, 4)).toEqual(b.split('$').slice(0, 4));
  });

  it('refuses an empty password', async () => {
    await expect(hashPassword('')).rejects.toThrow(/empty password/i);
  });
});

describe('verifyPassword', () => {
  it('accepts the correct password', async () => {
    const stored = await hashPassword('tarn-dev-password');
    await expect(verifyPassword('tarn-dev-password', stored)).resolves.toBe(true);
  });

  it('rejects an incorrect password', async () => {
    const stored = await hashPassword('tarn-dev-password');
    await expect(verifyPassword('wrong-password', stored)).resolves.toBe(false);
  });

  it('rejects a password that differs only in case', async () => {
    const stored = await hashPassword('Tarn-Dev-Password');
    await expect(verifyPassword('tarn-dev-password', stored)).resolves.toBe(false);
  });

  it('denies access for a malformed stored hash instead of throwing', async () => {
    for (const bad of ['', 'not-a-hash', 'scrypt$1$2$3', 'md5$32768$8$1$c2FsdA==$aGFzaA==', 'scrypt$x$8$1$c2FsdA==$aGFzaA==']) {
      await expect(verifyPassword('anything', bad)).resolves.toBe(false);
    }
  });

  it('denies access when cost parameters exceed what the machine allows', async () => {
    // N far beyond MAXMEM: must return false, not throw or hang.
    const stored = 'scrypt$999999999$8$1$c2FsdHNhbHRzYWx0c2E=$aGFzaGhhc2hoYXNoaGFzaGhhc2hoYQ==';
    await expect(verifyPassword('anything', stored)).resolves.toBe(false);
  });

  it('does not accept a hash of a different password with a swapped digest', async () => {
    const stored = await hashPassword('password-one');
    const [algo, n, r, p, salt] = stored.split('$');
    const forged = [algo, n, r, p, salt, Buffer.alloc(64, 7).toString('base64')].join('$');

    await expect(verifyPassword('password-one', forged)).resolves.toBe(false);
  });
});

describe('needsRehash', () => {
  it('is false for a hash at current policy', async () => {
    const stored = await hashPassword('x');
    expect(needsRehash(stored)).toBe(false);
  });

  it('is true for a weaker legacy hash', () => {
    expect(needsRehash('scrypt$1024$8$1$c2FsdA==$aGFzaA==')).toBe(true);
  });

  it('is true for an unparsable value', () => {
    expect(needsRehash('garbage')).toBe(true);
  });
});