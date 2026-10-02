/**
 * Tests for the shared status helpers.
 *
 * These exist because architecture §92 rule 12 asks for simple, testable
 * modules, and §62 requires unit tests for status transitions. Status is the
 * one piece of domain logic the frontend needs before any backend exists, and
 * it is cheap to verify — so it is verified rather than asserted.
 */
import { describe, expect, it } from 'vitest';
import {
  ACTIVE_STATUSES,
  APPLICATION_STATUSES,
  isActiveStatus,
  isTerminalStatus,
  TERMINAL_STATUSES,
  type ApplicationStatus,
} from './index';

describe('application status vocabulary', () => {
  it('matches the canonical PRD §12 set exactly', () => {
    expect([...APPLICATION_STATUSES]).toEqual([
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

  it('has no duplicate entries', () => {
    expect(new Set(APPLICATION_STATUSES).size).toBe(APPLICATION_STATUSES.length);
  });

  it('does not classify a terminal status as active', () => {
    for (const status of TERMINAL_STATUSES) {
      expect(isActiveStatus(status)).toBe(false);
    }
  });

  it('classifies ACCEPTED, REJECTED and WITHDRAWN as terminal', () => {
    expect(isTerminalStatus('ACCEPTED')).toBe(true);
    expect(isTerminalStatus('REJECTED')).toBe(true);
    expect(isTerminalStatus('WITHDRAWN')).toBe(true);
  });

  it('does not classify an active status as terminal', () => {
    for (const status of ACTIVE_STATUSES) {
      expect(isTerminalStatus(status)).toBe(false);
    }
  });

  it('partitions statuses into active, terminal, and the NO_RESPONSE remainder', () => {
    // PRD §5 shows NO_RESPONSE as an alternative exit from APPLIED rather than a
    // terminal outcome, so it sits in neither bucket. This test pins the
    // three-way partition explicitly instead of claiming active+terminal is
    // exhaustive, which it deliberately is not.
    const active = new Set<string>(ACTIVE_STATUSES);
    const terminal = new Set<string>(TERMINAL_STATUSES);
    const unclassified = APPLICATION_STATUSES.filter((s) => !active.has(s) && !terminal.has(s));

    expect([...active].filter((s) => terminal.has(s))).toEqual([]);
    expect(unclassified).toEqual(['NO_RESPONSE']);
    expect(active.size + terminal.size + unclassified.length).toBe(APPLICATION_STATUSES.length);
  });

  it('leaves NO_RESPONSE classified as neither active nor terminal', () => {
    // PRD §5 shows NO_RESPONSE as an alternative exit from APPLIED, but it is
    // not one of the three terminal states. This test pins that decision so a
    // future edit to the enum has to be deliberate.
    const status: ApplicationStatus = 'NO_RESPONSE';
    expect(isTerminalStatus(status)).toBe(false);
    expect(isActiveStatus(status)).toBe(false);
  });
});
