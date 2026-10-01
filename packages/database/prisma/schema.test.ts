/**
 * MVP scope guard (architecture §35, D-0004).
 *
 * These tests read `prisma/schema.prisma` directly rather than a generated
 * artifact, so they need no database and run in CI on every push.
 *
 * They exist to stop two specific drifts:
 *   1. A Phase 2+ table (especially `notifications`) being added early.
 *   2. An MVP table being dropped or renamed without an owner decision.
 *
 * A failure here means the schema and the decided scope disagree. Fix by
 * amending the decision in `.wwg/wiki/decisions/`, not by editing the enum.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

const here = dirname(fileURLToPath(import.meta.url));
const schemaPath = join(here, '..', 'prisma', 'schema.prisma');
const schema = readFileSync(schemaPath, 'utf8');

/** Tables from architecture §35 as amended by D-0004. */
const MVP_TABLES = [
  'users',
  'companies',
  'jobs',
  'skills',
  'job_skills',
  'applications',
  'saved_jobs',
  'timeline_events',
  'follow_ups',
  'offers',
] as const;

/** Tables architecture §87-§89 defer to Phase 2/3/4. */
const DEFERRED_TABLES = [
  'interviews',
  'contacts',
  'resumes',
  'cover_letters',
  'notifications',
  'user_skills',
  'application_skills',
] as const;

function mappedTables(): string[] {
  return [...schema.matchAll(/@@map\("([a-z_]+)"\)/g)].map((m) => m[1]!).sort();
}

function modelNames(): string[] {
  return [...schema.matchAll(/^model\s+(\w+)\s*\{/gm)].map((m) => m[1]!).sort();
}

describe('Prisma schema matches decided MVP scope', () => {
  it('defines exactly the MVP tables and nothing else', () => {
    expect(mappedTables()).toEqual([...MVP_TABLES].sort());
  });

  it('has a model for every MVP table', () => {
    // PascalCase models, kebab/snake tables (architecture §84).
    expect(modelNames()).toEqual(
      [
        'Application',
        'Company',
        'FollowUp',
        'Job',
        'JobSkill',
        'Offer',
        'SavedJob',
        'Skill',
        'TimelineEvent',
        'User',
      ].sort(),
    );
  });

  it.each(DEFERRED_TABLES)('does not define the deferred table %s', (table) => {
    expect(mappedTables()).not.toContain(table);
  });

  it('does not create a notifications enum or table (D-0004)', () => {
    expect(schema).not.toMatch(/@@map\("notifications"\)/);
    expect(schema).not.toMatch(/enum\s+Notification/i);
  });
});

describe('ownership boundary (D-0002, architecture §36)', () => {
  it('gives every user-owned table a userId column', () => {
    const userIdTables = new Set(
      [...schema.matchAll(/model\s+(\w+)\s*\{([\s\S]*?)\n\}/g)]
        .filter(([, , body]) => /userId\s+String/.test(body ?? ''))
        .map(([, name]) => name!),
    );

    // `User` is the owner itself, and `JobSkill` inherits ownership through
    // its parent rows. Both are exempt from needing a userId column.
    const exempt = new Set(['JobSkill', 'User']);

    for (const model of modelNames()) {
      if (exempt.has(model)) continue;
      expect(`${model}: ${userIdTables.has(model)}`).toBe(`${model}: true`);
    }
  });

  it('requires a users table so auth is not deferred', () => {
    expect(mappedTables()).toContain('users');
    expect(schema).toMatch(/model\s+User\s*\{/);
    expect(schema).toMatch(/passwordHash\s+String/);
  });
});

describe('status enums (architecture §43, PRD §12)', () => {
  it('defines exactly the twelve canonical statuses', () => {
    const block = schema.match(/enum\s+ApplicationStatus\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    const values = block
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//'));

    expect(values).toEqual([
      'SAVED',
      'APPLIED',
      'APPLICATION_VIEWED',
      'RECRUITER_CONTACTED',
      'HR_INTERVIEW',
      'TECHNICAL_INTERVIEW',
      'FINAL_INTERVIEW',
      'OFFER',
      'ACCEPTED',
      'REJECTED',
      'WITHDRAWN',
      'NO_RESPONSE',
    ]);
  });

  it('defines the three canonical priorities (PRD §13)', () => {
    const block = schema.match(/enum\s+ApplicationPriority\s*\{([\s\S]*?)\}/)?.[1] ?? '';
    expect(block.split('\n').map((l) => l.trim()).filter(Boolean)).toEqual(['LOW', 'MEDIUM', 'HIGH']);
  });
});

describe('indexes required by architecture §78', () => {
  it('indexes applications by owner, status and due date', () => {
    const block = schema.match(/model\s+Application\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(block).toMatch(/@@index\(\[userId, status\]\)/);
    expect(block).toMatch(/@@index\(\[nextActionDueAt\]\)/);
    expect(block).toMatch(/@@index\(\[appliedAt\]\)/);
  });

  it('indexes follow_ups for the upcoming-reminders query', () => {
    const block = schema.match(/model\s+FollowUp\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
    expect(block).toMatch(/@@index\(\[userId, state, dueAt\]\)/);
  });

  it('scopes skills per user rather than globally', () => {
    expect(schema).toMatch(/@@unique\(\[userId, name\]\)/);
  });
});