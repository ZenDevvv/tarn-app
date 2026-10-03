/**
 * Applications module — controller (architecture §20, §21).
 *
 * Controllers translate HTTP to service calls and back. No business logic and no
 * Prisma calls here (architecture §92 rules 1 and 2).
 */
import type { Request, Response } from 'express';
import {
  applicationIdSchema,
  createApplicationSchema,
  updateApplicationSchema,
  updateApplicationStatusSchema,
} from '@tarn/validation';
import { ok } from '../../types/api.js';
import * as service from './application.service.js';

/** Dates cross the wire as ISO strings, not `Date` objects. */
function serialize<
  T extends { createdAt: Date; updatedAt: Date; appliedAt: Date | null; nextActionDueAt: Date | null },
>(application: T) {
  return {
    ...application,
    createdAt: application.createdAt.toISOString(),
    updatedAt: application.updatedAt.toISOString(),
    appliedAt: application.appliedAt?.toISOString() ?? null,
    nextActionDueAt: application.nextActionDueAt?.toISOString() ?? null,
  };
}

/**
 * The owner comes from the verified session, never from the request body
 * (architecture §36, PRD §33). `requireAuth` guarantees it is present.
 */
function ownerId(req: Request): string {
  const userId = (req as { userId?: string }).userId;
  if (!userId) {
    // Unreachable behind `requireAuth`. Throwing rather than proceeding keeps a
    // future route wiring mistake from becoming an unscoped query.
    throw new Error('requireAuth did not attach userId. Check the route wiring.');
  }
  return userId;
}

export async function list(req: Request, res: Response): Promise<void> {
  const applications = await service.list(ownerId(req));
  res.json(ok(applications.map(serialize)));
}

export async function getById(req: Request, res: Response): Promise<void> {
  const id = applicationIdSchema.parse(req.params.id);
  const application = await service.findById(ownerId(req), id);
  res.json(ok(serialize(application)));
}

export async function create(req: Request, res: Response): Promise<void> {
  const input = createApplicationSchema.parse(req.body);
  const application = await service.create(ownerId(req), input);

  res.status(201).json(ok(serialize(application)));
}

export async function update(req: Request, res: Response): Promise<void> {
  const id = applicationIdSchema.parse(req.params.id);
  const input = updateApplicationSchema.parse(req.body);
  const application = await service.update(ownerId(req), id, input);

  res.json(ok(serialize(application)));
}

export async function changeStatus(req: Request, res: Response): Promise<void> {
  const id = applicationIdSchema.parse(req.params.id);
  const { status } = updateApplicationStatusSchema.parse(req.body);
  const application = await service.changeStatus(ownerId(req), id, status);

  res.json(ok(serialize(application)));
}

export async function remove(req: Request, res: Response): Promise<void> {
  const id = applicationIdSchema.parse(req.params.id);
  await service.remove(ownerId(req), id);

  res.status(204).end();
}

export async function timeline(req: Request, res: Response): Promise<void> {
  const id = applicationIdSchema.parse(req.params.id);
  const events = await service.timeline(ownerId(req), id);

  res.json(
    ok(
      events.map((event) => ({
        ...event,
        occurredAt: event.occurredAt.toISOString(),
        createdAt: event.createdAt.toISOString(),
      })),
    ),
  );
}
