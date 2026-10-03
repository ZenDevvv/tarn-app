/**
 * Error type and middleware (architecture §52).
 *
 * Error copy follows DESIGN.md §12: state what happened and what to do.
 * Never apologise, never say "Oops".
 */
import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { fail } from '../types/api.js';

export class AppError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: Record<string, string>;

  constructor(status: number, code: string, message: string, fields?: Record<string, string>) {
    super(message);
    this.name = 'AppError';
    this.status = status;
    this.code = code;
    this.fields = fields;
  }
}

export const notFound = (message = 'Could not find what you asked for.'): AppError =>
  new AppError(404, 'not_found', message);

export const unauthorized = (message = 'Sign in to continue.'): AppError =>
  new AppError(401, 'unauthorized', message);

/**
 * Deliberately identical for "not yours" and "does not exist".
 *
 * Differentiating them would let a signed-in user probe for the existence of
 * another user's records by id (architecture §32).
 */
export const forbiddenOrMissing = (): AppError =>
  new AppError(404, 'not_found', 'Could not find what you asked for.');

export const notFoundHandler: RequestHandler = (_req, res) => {
  res.status(404).json(fail('not_found', 'Could not find that route.'));
};

/**
 * Body-parser errors (architecture §55 request size limits).
 *
 * `express.json({ limit })` throws a generic error carrying `type` and `status`.
 * Without this branch it falls through to the catch-all below and the client
 * gets a 500 for what is actually a 413, which hides the real problem.
 */
interface BodyParserError {
  type?: string;
  status?: number;
  statusCode?: number;
}

function isBodyParserError(error: unknown): error is BodyParserError {
  return typeof error === 'object' && error !== null && typeof (error as BodyParserError).type === 'string';
}

/**
 * Errors raised by the rate limiter.
 *
 * The limiter rejects with a plain `Error` carrying `status`/`code`, so that it
 * stays independent of `AppError`. Without this branch it would fall through to
 * the catch-all and the client would get a 500 for what is a 429, hiding both
 * the reason and the `Retry-After` signal.
 */
interface StatusError extends Error {
  status: number;
  code: string;
}

function isStatusError(error: unknown): error is StatusError {
  if (typeof error !== 'object' || error === null) return false;
  const candidate = error as StatusError;
  return typeof candidate.status === 'number' && typeof candidate.code === 'string';
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (isStatusError(error) && !(error instanceof AppError)) {
    res.status(error.status).json(fail(error.code, error.message));
    return;
  }

  if (error instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of error.issues) {
      fields[issue.path.join('.') || '_'] = issue.message;
    }
    res.status(422).json(fail('validation_failed', 'Some fields need another look.', fields));
    return;
  }

  if (isBodyParserError(error)) {
    if (error.type === 'entity.too.large') {
      res.status(413).json(fail('payload_too_large', 'That request is too large. Try a smaller file.'));
      return;
    }
    // Malformed JSON, unsupported content type, and similar.
    const status = error.status ?? error.statusCode ?? 400;
    res
      .status(status)
      .json(fail('bad_request', "Couldn't read that request. Check the format and try again."));
    return;
  }

  if (error instanceof AppError) {
    res.status(error.status).json(fail(error.code, error.message, error.fields));
    return;
  }

  // Never leak internals to the client; log server-side (architecture §53).
  console.error(error);
  res.status(500).json(fail('internal_error', 'Something went wrong on our side. Try again.'));
};
