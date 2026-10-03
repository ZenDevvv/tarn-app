import { describe, expect, it } from 'vitest';
import { verifyPassword } from './password.js';

// Mirror of the constant in apps/api/src/modules/auth/auth.service.ts. Duplicated
// deliberately: the point of the assertion is that the literal parses.
const DUMMY_HASH =
  'scrypt$32768$8$1$AAAAAAAAAAAAAAAAAAAAAA==$' +
  'ZG8gbm90IG1hdGNoIGFueXRoaW5nLXBsYWNlaG9sZGVyLWJ5LWRlc2lnbi1wYWRkaW5nLTAwMDAwMDAwMDAwMDA=';

describe('enumeration-defence dummy hash', () => {
  it('parses as a real scrypt hash so it exercises the full verify path', async () => {
    expect(await verifyPassword('anything-at-all', DUMMY_HASH)).toBe(false);
  });

  it('has the six-field self-describing format', () => {
    expect(DUMMY_HASH.split('$')).toHaveLength(6);
  });
});
