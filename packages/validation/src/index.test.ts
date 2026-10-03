/**
 * Validation tests.
 *
 * `.wwg/governance/test-enforcement.md` rule 5: error copy must state what
 * happened and what to do (DESIGN.md §12). These tests pin both that the
 * schemas reject bad input and that the messages stay human.
 */
import { describe, expect, it } from 'vitest';
import {
  applicationFiltersSchema,
  createApplicationSchema,
  createJobSchema,
  createOfferSchema,
  createSavedJobSchema,
  loginSchema,
  registerSchema,
  updateApplicationSchema,
} from './index';

describe('registerSchema', () => {
  it('accepts a valid payload', () => {
    const result = registerSchema.safeParse({
      email: 'A@Example.com ',
      password: 'hunter2hunter2',
      name: ' Sam ',
    });
    expect(result.success).toBe(true);
    // Normalised for consistent storage and lookup.
    expect(result.success && result.data.email).toBe('a@example.com');
  });

  it('rejects a short password with actionable copy', () => {
    const result = registerSchema.safeParse({ email: 'a@example.com', password: 'short', name: 'Sam' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/at least 8/i);
  });

  it('rejects a malformed email', () => {
    expect(registerSchema.safeParse({ email: 'nope', password: 'hunter2hunter2', name: 'Sam' }).success).toBe(
      false,
    );
  });
});

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    expect(loginSchema.safeParse({ email: 'a@example.com', password: 'x' }).success).toBe(true);
  });

  it('rejects an empty password', () => {
    expect(loginSchema.safeParse({ email: 'a@example.com', password: '' }).success).toBe(false);
  });
});

const VALID_APPLICATION = {
  company: { name: 'Acme Corp' },
  job: { title: 'Frontend Engineer', platform: 'LINKEDIN' },
};

describe('createApplicationSchema', () => {
  it('defaults status to APPLIED (PRD §5)', () => {
    const result = createApplicationSchema.safeParse(VALID_APPLICATION);
    expect(result.success).toBe(true);
    expect(result.success && result.data.status).toBe('APPLIED');
  });

  it('accepts inline company and job details (architecture §23)', () => {
    const result = createApplicationSchema.safeParse({
      company: { name: '  Acme Corp  ', website: 'https://acme.test' },
      job: {
        title: 'Frontend Engineer',
        platform: 'OTHER',
        location: 'Remote',
        salaryMin: 50000,
        salaryMax: 90000,
        salaryCurrency: 'usd',
      },
    });

    expect(result.success).toBe(true);
    // Trimmed and normalised, not stored raw.
    expect(result.success && result.data.company.name).toBe('Acme Corp');
    expect(result.success && result.data.job.salaryCurrency).toBe('USD');
  });

  it('rejects an unknown status', () => {
    expect(createApplicationSchema.safeParse({ ...VALID_APPLICATION, status: 'NOPE' }).success).toBe(false);
  });

  it('rejects a missing company name', () => {
    const result = createApplicationSchema.safeParse({
      company: {},
      job: { title: 'X', platform: 'OTHER' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a missing job title', () => {
    const result = createApplicationSchema.safeParse({
      company: { name: 'Acme' },
      job: { platform: 'OTHER' },
    });
    expect(result.success).toBe(false);
  });

  it('rejects an inverted salary range', () => {
    const result = createApplicationSchema.safeParse({
      company: { name: 'Acme' },
      job: { title: 'X', platform: 'OTHER', salaryMin: 90000, salaryMax: 50000 },
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some((i) => i.message.includes('Minimum salary'))).toBe(true);
  });

  it('requires company and job — there is no jobId shortcut', () => {
    // The jobId form was replaced by inline details (owner decision 2026-10-03).
    // A payload carrying only jobId must not silently validate.
    expect(createApplicationSchema.safeParse({ jobId: 'clx1234567890abcdefghijk' }).success).toBe(false);
  });
});

describe('updateApplicationSchema', () => {
  it('allows clearing priority with null', () => {
    const result = updateApplicationSchema.safeParse({ priority: null });
    expect(result.success).toBe(true);
  });

  it('allows a partial update with no fields', () => {
    expect(updateApplicationSchema.safeParse({}).success).toBe(true);
  });
});

describe('createJobSchema', () => {
  it('accepts a minimal job', () => {
    expect(createJobSchema.safeParse({ title: 'Frontend Engineer', platform: 'LINKEDIN' }).success).toBe(
      true,
    );
  });

  it('rejects an inverted salary range with a specific message', () => {
    const result = createJobSchema.safeParse({
      title: 'Frontend Engineer',
      platform: 'LINKEDIN',
      salaryMin: 90000,
      salaryMax: 50000,
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/cannot be higher/i);
  });

  it('accepts an equal min and max', () => {
    expect(
      createJobSchema.safeParse({ title: 'X', platform: 'OTHER', salaryMin: 50000, salaryMax: 50000 })
        .success,
    ).toBe(true);
  });

  it('coerces numeric strings for salary', () => {
    const result = createJobSchema.safeParse({ title: 'X', platform: 'OTHER', salaryMin: '50000' });
    expect(result.success).toBe(true);
    expect(result.success && result.data.salaryMin).toBe(50000);
  });
});

describe('applicationFiltersSchema', () => {
  it('applies architecture §28 pagination and §30 sorting defaults', () => {
    const result = applicationFiltersSchema.parse({});
    expect(result.page).toBe(1);
    expect(result.perPage).toBe(20);
    expect(result.sortBy).toBe('updatedAt');
    expect(result.sortOrder).toBe('desc');
  });

  it('accepts a repeated status filter as an array', () => {
    const result = applicationFiltersSchema.parse({ status: ['APPLIED', 'OFFER'] });
    expect(result.status).toEqual(['APPLIED', 'OFFER']);
  });

  it('caps perPage to prevent unbounded reads (architecture §10.1)', () => {
    expect(applicationFiltersSchema.safeParse({ perPage: 100 }).success).toBe(true);
    expect(applicationFiltersSchema.safeParse({ perPage: 101 }).success).toBe(false);
  });

  it('rejects an unknown sort column rather than ignoring it', () => {
    expect(applicationFiltersSchema.safeParse({ sortBy: 'passwordHash' }).success).toBe(false);
  });
});

describe('MVP entities (D-0004)', () => {
  it('validates a saved job', () => {
    expect(createSavedJobSchema.safeParse({ title: 'Staff Engineer', platform: 'REFERRAL' }).success).toBe(
      true,
    );
  });

  it('rejects a saved job with a malformed url', () => {
    expect(createSavedJobSchema.safeParse({ title: 'X', platform: 'OTHER', url: 'not-a-url' }).success).toBe(
      false,
    );
  });

  it('validates an offer and normalises currency to upper case', () => {
    const result = createOfferSchema.safeParse({
      applicationId: 'clx1234567890abcdefghijk',
      salary: 120000,
      currency: 'php',
    });
    expect(result.success).toBe(true);
    expect(result.success && result.data.currency).toBe('PHP');
    expect(result.success && result.data.status).toBe('RECEIVED');
  });

  it('rejects a non three-letter currency code', () => {
    const result = createOfferSchema.safeParse({ applicationId: 'clx1234567890abcdefghijk', currency: 'PH' });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/three-letter/i);
  });
});

describe('ownership-relevant rejection', () => {
  it('drops a client-supplied userId rather than carrying it', () => {
    // The API must never accept an owner id from the client. Schemas here have
    // no field for it, so there is nothing to validate and nothing to persist.
    const result = createApplicationSchema.safeParse({
      ...VALID_APPLICATION,
      userId: 'attacker-controlled',
    });
    expect(result.success).toBe(true);
    expect(result.success && 'userId' in result.data).toBe(false);
  });

  it('drops a client-supplied companyId so a job cannot be attached elsewhere', () => {
    // `job.companyId` is not part of the inline shape. A client-supplied one is
    // stripped rather than trusted, which is what stops an application being
    // filed against another user's company by id.
    const result = createApplicationSchema.safeParse({
      ...VALID_APPLICATION,
      job: { ...VALID_APPLICATION.job, companyId: 'clxsomeothercompany0000000' },
    });

    expect(result.success).toBe(true);
    expect(result.success && 'companyId' in result.data.job).toBe(false);
  });
});
