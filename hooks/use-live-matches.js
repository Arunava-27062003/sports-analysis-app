import { useState, useEffect, useCallback, useRef } from 'react';
import { getLiveMatches } from '@/services/cricket-api';

const POLL_INTERVAL_MS = 60 * 1000; // 1 minute — backend caches for 60s anyway

export function useLiveMatches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLiveMatches();
      if (mounted.current) setMatches(data);
    } catch (e) {
      if (mounted.current) setMatches([]);
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const id = setInterval(refresh, POLL_INTERVAL_MS);
    return () => {
      mounted.current = false;
      clearInterval(id);
    };
  }, [refresh]);

  return { matches, loading, error, refresh };
}
