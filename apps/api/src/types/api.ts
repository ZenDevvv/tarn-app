/**
 * Shared HTTP types and the API response standard (architecture §27).
 *
 * The envelope shapes live in `@tarn/types` so the web app can consume them
 * without importing from the API app. Importing across app boundaries would
 * couple the client to the server's internals (architecture §83, §85).
 */
import type { Request } from 'express';
import type { ApiErrorBody, ApiMeta, ApiSuccess } from '@tarn/types';

export type { ApiErrorBody, ApiMeta, ApiSuccess };

/** Every authenticated request carries its resolved owner. */
export interface AuthenticatedRequest extends Request {
  userId: string;
}

export function ok<T>(data: T, meta?: ApiMeta): ApiSuccess<T> {
  return meta ? { data, meta } : { data };
}

export function fail(code: string, message: string, fields?: Record<string, string>): ApiErrorBody {
  return { error: fields ? { code, message, fields } : { code, message } };
}