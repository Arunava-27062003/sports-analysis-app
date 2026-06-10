// ─── Config ───────────────────────────────────────────────────────────────────

const BACKEND_URL = (process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://localhost:3000').trim();
const CRIC_API_KEY = (process.env.EXPO_PUBLIC_CRIC_API_KEY ?? '').trim();

// ─── Backend fetch helper ─────────────────────────────────────────────────────

async function backendGet(path, timeoutMs = 10000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(`${BACKEND_URL}${path}`, { signal: controller.signal });
    if (!res.ok) throw new Error('Unable to load data');
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ─── CricAPI direct fallback (used only when backend is unreachable) ──────────
// Returns data in the same shape as the backend so components don't need
// separate code paths.

function abbrev(name = '') {
  const map = {
    'India': 'IND', 'Australia': 'AUS', 'England': 'ENG', 'New Zealand': 'NZ',
    'South Africa': 'SA', 'Pakistan': 'PAK', 'Sri Lanka': 'SL', 'West Indies': 'WI',
    'Bangladesh': 'BAN', 'Afghanistan': 'AFG', 'Zimbabwe': 'ZIM', 'Ireland': 'IRE',
    'Scotland': 'SCO', 'Nepal': 'NEP', 'Netherlands': 'NED', 'Namibia': 'NAM',
    'Jersey': 'JER', 'Thailand': 'THA', 'Uganda': 'UGA', 'Canada': 'CAN',
    'Mumbai Indians': 'MI', 'Chennai Super Kings': 'CSK',
    'Royal Challengers Bengaluru': 'RCB', 'Kolkata Knight Riders': 'KKR',
    'Delhi Capitals': 'DC', 'Rajasthan Royals': 'RR',
    'Sunrisers Hyderabad': 'SRH', 'Punjab Kings': 'PBKS',
    'Gujarat Titans': 'GT', 'Lucknow Super Giants': 'LSG',
  };
  if (map[name]) return map[name];
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 3).toUpperCase();
  return words.map(w => w[0]).join('').toUpperCase().slice(0, 3);
}

function parseScore(scores, teamName) {
  if (!Array.isArray(scores) || !teamName) return null;
  const key = teamName.toLowerCase().split(' ')[0];
  const innings = scores.filter(s => (s.inning || '').toLowerCase().includes(key));
  if (!innings.length) return null;
  const last = innings[innings.length - 1];
  return { runs: last.r ?? 0, wickets: last.w ?? 0, overs: String(last.o ?? '0.0') };
}

function transformRawCricApiMatch(m) {
  const teams = m.teams || [];
  return {
    id: String(m.id || ''),
    seriesId: String(m.series_id || m.id || ''),
    seriesName: m.series || m.name || '',
    title: m.name || teams.join(' vs ') || 'Unknown',
    format: (m.matchType || '').toUpperCase(),
    status: 'live',
    statusText: m.status || 'Live',
    venue: m.venue || '',
    city: '',
    startDate: m.dateTimeGMT || '',
    team1: { id: teams[0] || '', name: teams[0] || '', short: abbrev(teams[0]), color: '#555', score: parseScore(m.score, teams[0]) },
    team2: { id: teams[1] || '', name: teams[1] || '', short: abbrev(teams[1]), color: '#555', score: parseScore(m.score, teams[1]) },
    result: null,
  };
}

async function fetchLiveFromCricApi() {
  if (!CRIC_API_KEY) return [];
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const res = await fetch(
      `https://api.cricapi.com/v1/currentMatches?apikey=${CRIC_API_KEY}&offset=0`,
      { signal: controller.signal }
    );
    if (!res.ok) throw new Error('Unable to load data');
    const json = await res.json();
    if (json.status !== 'success') return [];
    return (json.data ?? [])
      .filter(m => m.matchStarted && !m.matchEnded)
      .map(transformRawCricApiMatch);
  } catch {
    return [];
  } finally {
    clearTimeout(timer);
  }
}

// ─── Live matches — backend first, CricAPI if backend is down ─────────────────

export async function getLiveMatches() {
  try {
    const data = await backendGet('/api/cricket/live');
    return data.matches ?? [];
  } catch {
    // Backend unreachable — use direct CricAPI as last resort
    return fetchLiveFromCricApi();
  }
}

// ─── Recent completed matches ─────────────────────────────────────────────────

export async function getRecentMatches(format = null) {
  const query = format ? `?format=${encodeURIComponent(format)}` : '';
  const data = await backendGet(`/api/cricket/recent${query}`);
  return data.matches ?? [];
}

// ─── Upcoming matches ─────────────────────────────────────────────────────────

export async function getUpcomingMatches(format = null) {
  const query = format ? `?format=${encodeURIComponent(format)}` : '';
  const data = await backendGet(`/api/cricket/upcoming${query}`);
  return data.matches ?? [];
}

// ─── Full scorecard ───────────────────────────────────────────────────────────

export async function getMatchScorecard(seriesId, matchId) {
  const data = await backendGet(`/api/cricket/match/${seriesId}/${matchId}`);
  return data.match ?? null;
}

// ─── Team rankings (format: 'test' | 'odi' | 't20i') ─────────────────────────

export async function getCricketRankings(format) {
  const data = await backendGet(`/api/cricket/rankings/${encodeURIComponent(format)}`);
  return data.rankings ?? { format, teams: [] };
}

// ─── Active series ────────────────────────────────────────────────────────────

export async function getActiveSeries() {
  const data = await backendGet('/api/cricket/series');
  return data.series ?? [];
}

// ─── Top performers for a format ─────────────────────────────────────────────
// format: 'ipl' | 'test' | 'odi' | 't20i'

export async function getTopPlayers(format) {
  const data = await backendGet(`/api/cricket/topplayers/${encodeURIComponent(format)}`);
  return data.players ?? { batting: [], bowling: [], matchTitle: '' };
}

// ─── Health check ─────────────────────────────────────────────────────────────

export async function checkBackendHealth() {
  try {
    const data = await backendGet('/health', 5000);
    return data.status === 'ok';
  } catch {
    return false;
  }
}

// ─── Search (matches + players) ───────────────────────────────────────────────
export async function searchCricket(query, type = 'all') {
  if (!query || query.trim().length < 2) return { matches: [], players: [] };
  const params = new URLSearchParams({ q: query.trim(), type, limit: '20' });
  const data = await backendGet(`/api/cricket/search?${params}`);
  return { matches: data.matches ?? [], players: data.players ?? [] };
}
