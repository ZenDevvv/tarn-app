/**
 * Express application (architecture §21-§22).
 *
 * Layering is fixed: Route → Middleware → Controller → Service → Repository.
 * Business logic does not live in route files (architecture §92 rule 2), and
 * Prisma is never called from a route (rule 1).
 */
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Express } from 'express';
import { getAllowedOrigins } from './config/env.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';
import { requestId } from './middleware/request-id.js';
import { health } from './routes/health.js';
import { router as authRouter } from './modules/auth/auth.routes.js';

export const API_PREFIX = '/api/v1';

export function createApp(): Express {
  const app = express();

  // Behind a proxy/load balancer, trust the first hop for correct IPs and
  // protocol detection. Configure explicitly per environment in production.
  app.set('trust proxy', 1);

  app.use(requestId);

  // Architecture §55: HTTPS in production, secure cookies, CORS configuration.
  app.use(
    cors({
      origin: getAllowedOrigins(),
      credentials: true,
    }),
  );

  // Architecture §55: request size limits.
  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: false, limit: '1mb' }));
  app.use(cookieParser());

  // NOTE: health is mounted with app.get, not app.use. `app.use(path, fn)` treats
  // `fn` as middleware, so a 2-arity handler that always responds would answer
  // every request under /api/v1 and short-circuit all later routing.
  app.get(`${API_PREFIX}/health`, health);

  // Auth router mounts its own per-route guard (`/me` uses requireAuth, the rest
  // are the public entry points that establish a session).
  app.use(`${API_PREFIX}/auth`, authRouter);

  // Every other domain router must sit behind `requireAuth` (architecture §36):
  //   app.use(`${API_PREFIX}/applications`, requireAuth, applicationsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
