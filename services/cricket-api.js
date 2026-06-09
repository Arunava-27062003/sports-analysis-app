const API_KEY = (process.env.EXPO_PUBLIC_CRIC_API_KEY ?? '').trim();
const BASE_URL = 'https://api.cricapi.com/v1';

export const isApiConfigured = () => API_KEY.length > 0;

export async function fetchCurrentLiveMatches() {
  if (!isApiConfigured()) return [];

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(
      `${BASE_URL}/currentMatches?apikey=${API_KEY}&offset=0`,
      { signal: controller.signal },
    );
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.status !== 'success') throw new Error(json.status ?? 'API error');
    return (json.data ?? []).filter(m => m.matchStarted && !m.matchEnded);
  } finally {
    clearTimeout(timer);
  }
}
