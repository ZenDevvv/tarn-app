/**
 * Session-refresh behaviour in the API client.
 *
 * Subtle enough to deserve direct tests: the access token is short-lived, so a
 * 401 usually means "refresh me" rather than "signed out", and getting that wrong
 * in either direction is a real bug.
 *
 *   - treating every 401 as signed out  -> a user is logged out of a live session
 *   - treating every 401 as refreshable  -> a failed sign-in loops and burns budget
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { apiFetch } from './api-client';

function jsonResponse(status: number, body: unknown = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
  } as unknown as Response;
}

let fetchMock: ReturnType<typeof vi.fn>;

beforeEach(() => {
  fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('apiFetch transparent refresh', () => {
  it('refreshes and replays when a request 401s', async () => {
    fetchMock
      // 1: the original request, access token expired
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized', message: 'no' } }))
      // 2: the refresh
      .mockResolvedValueOnce(jsonResponse(200))
      // 3: the replay, now authorised
      .mockResolvedValueOnce(jsonResponse(200, { data: { ok: true } }));

    await expect(apiFetch('/companies')).resolves.toEqual({ ok: true });

    expect(fetchMock).toHaveBeenCalledTimes(3);
    expect(String(fetchMock.mock.calls[1]?.[0])).toContain('/auth/refresh');
    expect(String(fetchMock.mock.calls[2]?.[0])).toContain('/companies');
  });

  /**
   * The defect this prevents: a user returning after 20 minutes has a valid
   * 7-day refresh token but an expired access token. Treating that 401 as
   * "signed out" logs them out of a session they never ended.
   */
  it('refreshes on a 401 from /auth/me rather than declaring the session over', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized' } }))
      .mockResolvedValueOnce(jsonResponse(200))
      .mockResolvedValueOnce(jsonResponse(200, { data: { user: { id: 'u1' } } }));

    await expect(apiFetch('/auth/me')).resolves.toEqual({ user: { id: 'u1' } });

    expect(fetchMock.mock.calls.some((call) => String(call[0]).includes('/auth/refresh'))).toBe(true);
  });

  it('stops after a failed refresh, without wasting a replay', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { error: { code: 'unauthorized' } }));

    await expect(apiFetch('/companies')).rejects.toMatchObject({ status: 401 });

    // original + refresh. The refresh 401'd, so there is nothing to replay.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('replays at most once, so a replay that also 401s cannot loop', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized' } }))
      .mockResolvedValueOnce(jsonResponse(200)) // refresh succeeds
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized' } })); // replay 401s

    await expect(apiFetch('/companies')).rejects.toMatchObject({ status: 401 });

    // Exactly one replay, then it surfaces the error.
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  /**
   * The opposite defect: a wrong password is not an expired token. Refreshing and
   * replaying a failed sign-in wastes a round trip and burns rate-limit budget.
   */
  it('does not refresh after a failed sign-in', async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(401, { error: { code: 'invalid_credentials', message: 'wrong' } }),
    );

    await expect(apiFetch('/auth/login', { method: 'POST' })).rejects.toMatchObject({
      code: 'invalid_credentials',
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('never tries to refresh the refresh endpoint itself', async () => {
    fetchMock.mockResolvedValue(jsonResponse(401, { error: { code: 'unauthorized' } }));

    await expect(apiFetch('/auth/refresh', { method: 'POST' })).rejects.toMatchObject({
      status: 401,
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shares one refresh across concurrent 401s instead of stampeding', async () => {
    fetchMock.mockImplementation(async (url: string) => {
      if (String(url).includes('/auth/refresh')) return jsonResponse(200);
      return jsonResponse(401, { error: { code: 'unauthorized' } });
    });

    // Three requests expire at once; only one refresh should go out.
    await Promise.allSettled([apiFetch('/a'), apiFetch('/b'), apiFetch('/c')]);

    const refreshCalls = fetchMock.mock.calls.filter((call) => String(call[0]).includes('/auth/refresh'));
    expect(refreshCalls.length).toBe(1);
  });

  it('does not refresh when the response was a success', async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: { ok: true } }));

    await expect(apiFetch('/companies')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  /**
   * The refresh call is best-effort. If it fails at the transport level — offline,
   * DNS failure, CORS — the original 401 is what the caller should see, not a
   * `TypeError: Failed to fetch` leaking out of a recovery path.
   */
  it('surfaces the original error when the refresh call itself fails to connect', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized', message: 'no' } }))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'));

    await expect(apiFetch('/companies')).rejects.toMatchObject({
      status: 401,
      code: 'unauthorized',
    });
    // No replay attempted, since the refresh never succeeded.
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('recovers on a later request after a failed refresh is not cached', async () => {
    fetchMock
      // First cycle: refresh fails at the transport level.
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized' } }))
      .mockRejectedValueOnce(new TypeError('Failed to fetch'))
      // Second cycle: refresh works, so the session recovers.
      .mockResolvedValueOnce(jsonResponse(401, { error: { code: 'unauthorized' } }))
      .mockResolvedValueOnce(jsonResponse(200))
      .mockResolvedValueOnce(jsonResponse(200, { data: { ok: true } }));

    await expect(apiFetch('/companies')).rejects.toMatchObject({ status: 401 });
    await expect(apiFetch('/companies')).resolves.toEqual({ ok: true });
  });
});
