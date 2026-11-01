/**
 * Tiny client-side request cache.
 *
 * Purpose:
 * - Dedupe concurrent calls: identical requests fired in the same tick
 *   (React StrictMode double-render, several widgets mounting together)
 *   share a single in-flight promise.
 * - Reuse the resolved value for `ttlMs` instead of re-fetching on every mount.
 * - `get({ force: true })` bypasses both the in-flight promise and the cached
 *   value; `invalidate()` drops the cached value.
 *
 * The cache lives in module scope, so it is per-browser-tab and disappears on
 * a full page reload. That is intentional: this is UI-level caching, not a
 * substitute for server-side caching.
 */

export interface CachedRequestOptions {
  /** Ignore the cached value and fetch again. */
  force?: boolean;
}

export interface CachedRequest<T> {
  get(options?: CachedRequestOptions): Promise<T>;
  /** Drop the cached value so the next `get()` fetches again. */
  invalidate(): void;
}

interface CacheEntry<T> {
  value: T;
  at: number;
}

export function createCachedRequest<T>(
  fetcher: () => Promise<T>,
  ttlMs: number = 60_000,
): CachedRequest<T> {
  let entry: CacheEntry<T> | null = null;
  let inFlight: Promise<T> | null = null;

  const fetchOnce = (): Promise<T> => {
    if (inFlight) return inFlight;

    inFlight = fetcher()
      .then((value) => {
        entry = { value, at: Date.now() };
        return value;
      })
      .finally(() => {
        inFlight = null;
      });

    return inFlight;
  };

  return {
    get(options?: CachedRequestOptions): Promise<T> {
      const force = options?.force === true;

      if (!force && entry && Date.now() - entry.at < ttlMs) {
        return Promise.resolve(entry.value);
      }

      return fetchOnce();
    },

    invalidate(): void {
      entry = null;
    },
  };
}
