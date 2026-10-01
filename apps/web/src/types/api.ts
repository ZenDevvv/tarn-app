/**
 * Frontend-facing API types.
 *
 * Re-exported from `@tarn/types` so the web app never imports from the API
 * app (architecture §83, §85).
 */
export type { ApiErrorBody, ApiMeta, ApiSuccess } from '@tarn/types';