/**
 * Request correlation (architecture §54).
 *
 * Every request gets an id, returned in a response header and logged with any
 * error, so a failure can be traced without guessing from timing.
 */
import type { RequestHandler } from 'express';
import { randomUUID } from 'node:crypto';

export const requestId: RequestHandler = (req, res, next) => {
  const incoming = req.header('x-request-id');
  const id = incoming && incoming.length <= 100 ? incoming : randomUUID();

  res.locals.requestId = id;
  res.setHeader('x-request-id', id);
  next();
};