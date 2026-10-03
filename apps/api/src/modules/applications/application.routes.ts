/**
 * Applications routes (architecture §26, §38).
 *
 *   GET    /api/v1/applications
 *   GET    /api/v1/applications/:id
 *   POST   /api/v1/applications
 *   PATCH  /api/v1/applications/:id
 *   DELETE /api/v1/applications/:id
 *   PATCH  /api/v1/applications/:id/status
 *   GET    /api/v1/applications/:id/timeline
 *
 * **`requireAuth` on the whole router, not per route.** Architecture §36: every
 * domain router must sit behind the guard. Mounting it per route is how the next
 * route someone adds ends up unprotected.
 *
 * Note `GET /:id/timeline` is not in architecture §26. It is included because the
 * create and status-change paths both write timeline entries, and leaving them
 * unreadable would make the feature untestable from the outside and useless to a
 * user wondering what happened to an application.
 */
import { Router, type Router as ExpressRouter } from 'express';
import { asyncHandler } from '../../middleware/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import * as controller from './application.controller.js';

export const router: ExpressRouter = Router();

router.use(requireAuth);

router.get('/', asyncHandler(controller.list));
router.post('/', asyncHandler(controller.create));
router.get('/:id', asyncHandler(controller.getById));
router.patch('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));
router.patch('/:id/status', asyncHandler(controller.changeStatus));
router.get('/:id/timeline', asyncHandler(controller.timeline));
