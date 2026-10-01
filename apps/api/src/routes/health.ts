/**
 * Health route.
 *
 * The only public route in the scaffold. It reports liveness without touching
 * the database so it stays useful when the DB is down.
 */
import type { RequestHandler } from 'express';
import { ok } from '../types/api.js';

export const health: RequestHandler = (_req, res) => {
  res.status(200).json(ok({ status: 'ok', service: 'tarn-api' }));
};