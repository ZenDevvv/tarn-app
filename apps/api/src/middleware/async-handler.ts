/**
 * Async handler bridge.
 *
 * **Why this file exists.** Express 4 does not catch rejected promises from
 * handlers. An `async` handler that throws or rejects produces an *unhandled
 * promise rejection*, the request hangs until the client times out, and the
 * error handler never runs.
 *
 * This was not theoretical. Every auth controller is `async` (they hash a
 * password, which is async), and the auth route tests caught it immediately:
 * validation errors and 401s were escaping as unhandled rejections instead of
 * returning 422 and 401.
 *
 * Express 5 fixes this natively. Until then, wrap every async handler.
 */
import type { NextFunction, Request, RequestHandler, Response } from 'express';

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown> | unknown;

export function asyncHandler(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    void Promise.resolve(handler(req, res, next)).catch(next);
  };
}
