import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { findMatchById } from '@/data/cricket';

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export default function MatchDetailScreen() {
  const { id } = useLocalSearchParams();
  const match = findMatchById(String(id));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg            = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';
  const innerBg       = isDark ? '#13171D' : '#F7F9FC';

  if (!match) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backLabel, { color: textSecondary }]}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: textSecondary }]}>Match not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const isTeam1Winner = match.winner === match.team1.short;
  const isTeam2Winner = match.winner === match.team2.short;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{match.tournament}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {/* ── Content ── */}
      <View style={[styles.contentArea, { backgroundColor: bg }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >

          {/* Match hero */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.matchNumText, { color: textSecondary }]}>
              {typeof match.matchNumber === 'number'
                ? `Match ${match.matchNumber}`
                : match.matchNumber}
              {' · '}{match.format}
            </Text>

            <TeamHeroRow
              team={match.team1}
              innings={match.innings1}
              isWinner={isTeam1Winner}
              isTest={match.isTest}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
            <View style={[styles.teamDivider, { backgroundColor: borderColor }]} />
            <TeamHeroRow
              team={match.team2}
              innings={match.innings2}
              isWinner={isTeam2Winner}
              isTest={match.isTest}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />

            <View style={[styles.resultBanner, { borderTopColor: borderColor }]}>
              <Text style={styles.resultText}>{match.result}</Text>
              {match.manOfMatch && (
                <Text style={[styles.momText, { color: textSecondary }]}>
                  Player of the Match: {match.manOfMatch}
                </Text>
              )}
            </View>
          </View>

          {/* Scorecard sections */}
          {!match.isTest && match.innings1?.batting && (
            <InningsCard
              innings={match.innings1}
              label="1st Innings"
              isDark={isDark}
              cardBg={cardBg}
              innerBg={innerBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {!match.isTest && match.innings2?.batting && (
            <InningsCard
              innings={match.innings2}
              label="2nd Innings"
              isDark={isDark}
              cardBg={cardBg}
              innerBg={innerBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {/* Match facts */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.cardSectionTitle, { color: textPrimary }]}>Match Details</Text>
            <FactRow label="Tournament" value={match.tournament}       last={false} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
            <FactRow label="Venue"      value={match.venue}            last={false} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
            <FactRow label="City"       value={match.city ?? '—'}      last={false} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
            <FactRow label="Date"       value={formatDate(match.date)} last={!(match.note || match.highlight || match.seriesResult)} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
            {(match.note || match.highlight || match.seriesResult) && (
              <View style={[styles.noteRow, { borderTopColor: borderColor }]}>
                <Text style={[styles.noteText, { color: textSecondary }]}>
                  {match.note || match.highlight || match.seriesResult}
                </Text>
              </View>
            )}
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── TeamHeroRow ──────────────────────────────────────────────────────────────

function TeamHeroRow({ team, innings, isWinner, isTest, textPrimary, textSecondary }) {
  let scoreStr;
  if (isTest) {
    scoreStr = innings?.testScore ?? '—';
  } else if (innings) {
    scoreStr = `${innings.totalRuns}/${innings.wickets} (${innings.overs})`;
  } else {
    scoreStr = '— / —';
  }

  return (
    <View style={styles.teamHeroRow}>
      <View style={styles.teamHeroLeft}>
        <View style={[styles.teamBadge, { backgroundColor: team.color }]}>
          <Text style={styles.teamBadgeText}>{team.short}</Text>
        </View>
        <View>
          <Text style={[styles.teamHeroName, { color: textPrimary }, isWinner && styles.winnerName]}>
            {team.name ?? team.short}
          </Text>
          {isWinner && <Text style={styles.wonChip}>Winner</Text>}
        </View>
      </View>
      <Text style={[styles.teamHeroScore, { color: isWinner ? textPrimary : textSecondary }, isWinner && styles.winnerName]}>
        {scoreStr}
      </Text>
    </View>
  );
}

// ── InningsCard ──────────────────────────────────────────────────────────────

function InningsCard({ innings, label, isDark, cardBg, innerBg, borderColor, textPrimary, textSecondary }) {
  const hasBatting = innings.batting?.length > 0;
  const hasBowling = innings.bowling?.length > 0;

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>

      {/* Innings title bar */}
      <View style={[styles.inningsHeader, { backgroundColor: innings.teamColor + '22', borderBottomColor: borderColor }]}>
        <View style={[styles.teamBadgeSmall, { backgroundColor: innings.teamColor }]}>
          <Text style={styles.teamBadgeText}>{innings.teamShort}</Text>
        </View>
        <Text style={[styles.inningsLabel, { color: textPrimary }]}>
          {label} · {innings.teamShort}
        </Text>
        <Text style={[styles.inningsTotal, { color: textPrimary }]}>
          {innings.totalRuns}/{innings.wickets}{' '}
          <Text style={[styles.inningsOvers, { color: textSecondary }]}>({innings.overs})</Text>
        </Text>
      </View>

      {/* Batting */}
      {hasBatting && (
        <>
          <View style={[styles.tableHead, { backgroundColor: innerBg, borderBottomColor: borderColor }]}>
            <Text style={[styles.tableHeadLabel, { color: textSecondary }]}>BATTING</Text>
            <View style={styles.battingStatCols}>
              {['R','B','4s','6s','SR'].map(h => (
                <Text key={h} style={[styles.colH, { color: textSecondary }]}>{h}</Text>
              ))}
            </View>
          </View>
          {innings.batting.map((b, i) => (
            <View
              key={i}
              style={[
                styles.battingRow,
                i < innings.batting.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
              ]}
            >
              <View style={styles.batterInfo}>
                <Text style={[styles.batterName, { color: textPrimary }]}>{b.playerName}</Text>
                {b.dismissal ? (
                  <Text style={[styles.dismissal, { color: textSecondary }]} numberOfLines={1}>
                    {b.dismissal}
                  </Text>
                ) : null}
              </View>
              <View style={styles.battingStatCols}>
                <Text style={[styles.statVal, { color: b.dismissal === 'not out' ? '#10B981' : textPrimary, fontWeight: '700' }]}>
                  {b.runs}{b.dismissal === 'not out' ? '*' : ''}
                </Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>{b.balls}</Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>{b.fours ?? '—'}</Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>{b.sixes ?? '—'}</Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>
                  {b.strikeRate != null ? b.strikeRate.toFixed(1) : '—'}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}

      {/* Bowling */}
      {hasBowling && (
        <>
          <View style={[
            styles.tableHead,
            { backgroundColor: innerBg, borderBottomColor: borderColor, borderTopColor: borderColor, borderTopWidth: 1 },
          ]}>
            <Text style={[styles.tableHeadLabel, { color: textSecondary }]}>BOWLING</Text>
            <View style={styles.bowlingStatCols}>
              {['O','M','R','W','Eco'].map(h => (
                <Text key={h} style={[styles.colH, { color: textSecondary }]}>{h}</Text>
              ))}
            </View>
          </View>
          {innings.bowling.map((b, i) => (
            <View
              key={i}
              style={[
                styles.bowlingRow,
                i < innings.bowling.length - 1 && { borderBottomWidth: 1, borderBottomColor: borderColor },
              ]}
            >
              <Text style={[styles.bowlerName, { color: textPrimary }]}>{b.playerName}</Text>
              <View style={styles.bowlingStatCols}>
                <Text style={[styles.statVal, { color: textSecondary }]}>{b.overs}</Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>{b.maidens}</Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>{b.runs}</Text>
                <Text style={[
                  styles.statVal,
                  { color: b.wickets > 0 ? '#EF4444' : textPrimary, fontWeight: b.wickets > 0 ? '700' : '500' },
                ]}>
                  {b.wickets}
                </Text>
                <Text style={[styles.statVal, { color: textSecondary }]}>
                  {typeof b.economy === 'number' ? b.economy.toFixed(2) : b.economy}
                </Text>
              </View>
            </View>
          ))}
        </>
      )}
    </View>
  );
}

// ── FactRow ──────────────────────────────────────────────────────────────────

function FactRow({ label, value, last, borderColor, textPrimary, textSecondary }) {
  return (
    <View style={[styles.factRow, !last && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <Text style={[styles.factLabel, { color: textSecondary }]}>{label}</Text>
      <Text style={[styles.factValue, { color: textPrimary }]}>{value}</Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const COL_W = 36;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    gap: 10,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, minWidth: 56 },
  backArrow: { color: '#FFFFFF', fontSize: 20, lineHeight: 24 },
  backLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
  headerTitle: { flex: 1, color: '#FFFFFF', fontSize: 15, fontWeight: '600', textAlign: 'center' },
  headerSpacer: { minWidth: 56 },

  scroll: { padding: 14, paddingBottom: 36 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16 },

  // Cards
  card: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },

  // Match hero
  matchNumText: { fontSize: 12, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  teamHeroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  teamHeroLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  teamBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  teamBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: -0.5 },
  teamHeroName: { fontSize: 16, fontWeight: '500' },
  winnerName: { fontWeight: '700' },
  wonChip: {
    marginTop: 2,
    backgroundColor: '#27AE60',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  teamHeroScore: { fontSize: 18, fontWeight: '600' },
  teamDivider: { height: 1, marginHorizontal: 16 },

  resultBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
    borderTopWidth: 1,
    backgroundColor: 'rgba(39,174,96,0.08)',
  },
  resultText: { color: '#27AE60', fontSize: 13, fontWeight: '600' },
  momText: { fontSize: 12 },

  // Innings card
  inningsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
  },
  teamBadgeSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inningsLabel: { flex: 1, fontSize: 14, fontWeight: '700' },
  inningsTotal: { fontSize: 16, fontWeight: '700' },
  inningsOvers: { fontSize: 12, fontWeight: '400' },

  tableHead: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    justifyContent: 'space-between',
  },
  tableHeadLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  battingStatCols: { flexDirection: 'row', gap: 0 },
  bowlingStatCols: { flexDirection: 'row', gap: 0 },
  colH: { width: COL_W, fontSize: 11, fontWeight: '600', textAlign: 'center' },

  battingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  batterInfo: { flex: 1, paddingRight: 8 },
  batterName: { fontSize: 13, fontWeight: '600' },
  dismissal: { fontSize: 11, marginTop: 2 },
  statVal: { width: COL_W, fontSize: 13, fontWeight: '500', textAlign: 'center' },

  bowlingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  bowlerName: { flex: 1, fontSize: 13, fontWeight: '600', paddingRight: 8 },

  // Facts
  cardSectionTitle: { fontSize: 15, fontWeight: '700', paddingHorizontal: 14, paddingVertical: 12 },
  factRow: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 11, gap: 12 },
  factLabel: { width: 90, fontSize: 13 },
  factValue: { flex: 1, fontSize: 13, fontWeight: '500' },
  noteRow: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1 },
  noteText: { fontSize: 12, fontStyle: 'italic', lineHeight: 18 },
});
