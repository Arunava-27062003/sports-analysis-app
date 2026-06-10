import { useState, useEffect, useCallback } from 'react';

/**
 * Generic hook for one-shot backend data fetches with loading/error state.
 *
 * @param {() => Promise<any>} fetchFn  Async function that returns the data
 * @param {any[]} deps  Re-fetch when these change (default: run once on mount)
 */
export function useCricketData(fetchFn, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      setData(result);
    } catch (e) {
      setError(e.message ?? 'Failed to load data');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, reload: load };
}
