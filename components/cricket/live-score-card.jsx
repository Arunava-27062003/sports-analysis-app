import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

// ── Lookup tables ──────────────────────────────────────────────────────────────

const TEAM_SHORTS = {
  'India': 'IND', 'Australia': 'AUS', 'England': 'ENG',
  'New Zealand': 'NZ', 'South Africa': 'SA', 'Pakistan': 'PAK',
  'Sri Lanka': 'SL', 'West Indies': 'WI', 'Bangladesh': 'BAN',
  'Afghanistan': 'AFG', 'Zimbabwe': 'ZIM', 'Ireland': 'IRE',
  'Netherlands': 'NED', 'Scotland': 'SCO', 'USA': 'USA',
  'Namibia': 'NAM', 'Nepal': 'NEP',
};

const TEAM_COLORS = {
  'India': '#003580', 'Australia': '#B5831B', 'England': '#002D62',
  'New Zealand': '#1B1B1B', 'South Africa': '#007749', 'Pakistan': '#014421',
  'Sri Lanka': '#003478', 'West Indies': '#7B0041', 'Bangladesh': '#006A4E',
  'Afghanistan': '#002868',
};

const FORMAT_LABELS = {
  test: 'Test Match', odi: 'ODI', t20: 'T20I', t20i: 'T20I',
};

function teamShort(name) {
  return TEAM_SHORTS[name] ?? name.slice(0, 3).toUpperCase();
}

function teamColor(name) {
  return TEAM_COLORS[name] ?? '#555555';
}

// CricAPI inning strings: "India Inning 1", "Australia Innings 2", etc.
function parseInningTeam(inningStr) {
  return inningStr.replace(/\s+innings?\s+\d+$/i, '').trim();
}

// ── LiveScoreCard ──────────────────────────────────────────────────────────────

export function LiveScoreCard({ match }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg        = isDark ? '#1E2427' : '#FFFFFF';
  const borderColor   = isDark ? '#2C3338' : '#E8ECEF';
  const textPrimary   = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#687076';
  const innerBg       = isDark ? '#13171D' : '#F7F9FC';

  const {
    name      = '',
    status    = '',
    venue     = '',
    score     = [],
    matchType = '',
    teams     = [],
  } = match;

  const formatLabel = FORMAT_LABELS[matchType.toLowerCase()] ?? matchType.toUpperCase();

  // Build innings rows from score array
  const inningsRows = score.map(s => ({
    team:    parseInningTeam(s.inning),
    inning:  s.inning.match(/\d+$/)?.[0] ?? '1',
    runs:    s.r ?? 0,
    wickets: s.w ?? 0,
    overs:   s.o ?? 0,
  }));

  // Teams that haven't batted yet
  const battedTeams = new Set(inningsRows.map(r => r.team));
  const yetToBat    = teams.filter(t => !battedTeams.has(t));

  // For Test matches show inning number in label
  const showInningNum = inningsRows.length > 2;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.livePillText}>LIVE</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={[styles.matchName, { color: textPrimary }]} numberOfLines={1}>
            {name}
          </Text>
          <Text style={[styles.matchMeta, { color: textSecondary }]} numberOfLines={1}>
            {formatLabel}{venue ? ` · ${venue}` : ''}
          </Text>
        </View>
      </View>

      {/* Scorecard */}
      <View style={[styles.scores, {
        borderTopColor: borderColor, borderBottomColor: borderColor,
        backgroundColor: innerBg,
      }]}>
        {inningsRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.inningsRow,
              i > 0 && { borderTopWidth: 1, borderTopColor: borderColor },
            ]}
          >
            <View style={[styles.teamBadge, { backgroundColor: teamColor(row.team) }]}>
              <Text style={styles.teamBadgeText}>{teamShort(row.team)}</Text>
            </View>
            <Text style={[styles.teamLabel, { color: textSecondary }]}>
              {teamShort(row.team)}{showInningNum ? ` (Inn ${row.inning})` : ''}
            </Text>
            <Text style={[styles.inningsScore, { color: textPrimary }]}>
              {row.runs}/{row.wickets}{' '}
              <Text style={[styles.overs, { color: textSecondary }]}>
                ({row.overs} ov)
              </Text>
            </Text>
          </View>
        ))}

        {yetToBat.map((team, i) => (
          <View
            key={`ytb-${i}`}
            style={[
              styles.inningsRow,
              (inningsRows.length > 0 || i > 0) && {
                borderTopWidth: 1, borderTopColor: borderColor,
              },
            ]}
          >
            <View style={[styles.teamBadge, { backgroundColor: teamColor(team) }]}>
              <Text style={styles.teamBadgeText}>{teamShort(team)}</Text>
            </View>
            <Text style={[styles.teamLabel, { color: textSecondary }]}>
              {teamShort(team)}
            </Text>
            <Text style={[styles.inningsScore, { color: textSecondary }]}>
              Yet to bat
            </Text>
          </View>
        ))}
      </View>

      {/* Status */}
      <View style={styles.statusRow}>
        <Text style={[styles.statusText, { color: textPrimary }]} numberOfLines={3}>
          {status}
        </Text>
      </View>

    </View>
  );
}

// ── LiveSection ────────────────────────────────────────────────────────────────

export function LiveSection({ matches, loading, error, refresh, configured }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';

  return (
    <View style={styles.section}>

      {/* Section header with refresh */}
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <View style={styles.sectionLiveDot} />
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>Live Now</Text>
        </View>
        {configured && (
          <TouchableOpacity
            onPress={refresh}
            disabled={loading}
            style={styles.refreshBtn}
          >
            {loading
              ? <ActivityIndicator size="small" color="#4ADE80" />
              : <Text style={styles.refreshText}>↻ Refresh</Text>
            }
          </TouchableOpacity>
        )}
      </View>

      {/* No API key */}
      {!configured && (
        <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.emptyTitle, { color: textPrimary }]}>
            Real-time scores not configured
          </Text>
          <Text style={[styles.emptyBody, { color: textSecondary }]}>
            Add your free CricAPI key to{' '}
            <Text style={{ fontWeight: '700' }}>.env</Text>
            {' '}as{' '}
            <Text style={{ fontWeight: '700' }}>EXPO_PUBLIC_CRIC_API_KEY</Text>
            {' '}then restart the dev server.{'\n'}Get a free key at{' '}
            <Text style={{ fontWeight: '700' }}>cricapi.com</Text>
            {' '}(100 calls / day).
          </Text>
        </View>
      )}

      {/* Error */}
      {configured && error && !loading && (
        <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.emptyBody, { color: '#EF4444' }]}>
            Could not fetch live scores · {error}
          </Text>
        </View>
      )}

      {/* No live matches */}
      {configured && !loading && !error && matches.length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor }]}>
          <Text style={[styles.emptyBody, { color: textSecondary }]}>
            No matches live right now
          </Text>
        </View>
      )}

      {/* Live match cards */}
      {matches.map(m => <LiveScoreCard key={m.id} match={m} />)}

    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Section wrapper
  section: { marginBottom: 8 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  sectionLiveDot: {
    width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444',
  },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  refreshBtn: { paddingVertical: 4, paddingHorizontal: 10 },
  refreshText: { fontSize: 13, fontWeight: '600', color: '#4ADE80' },

  // Card
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 12,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  livePillText: {
    color: '#EF4444', fontSize: 10, fontWeight: '800', letterSpacing: 1,
  },
  headerInfo: { flex: 1 },
  matchName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  matchMeta: { fontSize: 12 },

  // Scorecard
  scores: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingHorizontal: 14,
  },
  inningsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  teamBadge: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  teamBadgeText: {
    color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: -0.5,
  },
  teamLabel: { flex: 1, fontSize: 14, fontWeight: '600' },
  inningsScore: { fontSize: 18, fontWeight: '700' },
  overs: { fontSize: 12, fontWeight: '400' },

  // Status footer
  statusRow: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  statusText: { fontSize: 13, fontWeight: '500', lineHeight: 18 },

  // Empty / error states
  emptyCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 14, fontWeight: '700', marginBottom: 6 },
  emptyBody: { fontSize: 13, lineHeight: 20 },
});
