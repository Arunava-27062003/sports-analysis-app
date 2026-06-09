import { useState, useEffect, useCallback } from 'react';
import { fetchCurrentLiveMatches, isApiConfigured } from '@/services/cricket-api';

const POLL_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes (~288 calls/day max)

export function useLiveMatches() {
  const configured = isApiConfigured();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const refresh = useCallback(async () => {
    if (!configured) return;
    setLoading(true);
    setError(null);
    try {
      setMatches(await fetchCurrentLiveMatches());
    } catch (e) {
      setError(e.message ?? 'Failed to fetch live scores');
    } finally {
      setLoading(false);
    }
  }, [configured]);

  useEffect(() => {
    refresh();
    if (!configured) return;
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [refresh, configured]);

  return { matches, loading, error, refresh, configured };
}
