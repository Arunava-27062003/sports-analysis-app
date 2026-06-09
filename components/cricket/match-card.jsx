import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function MatchCard({ match }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg       = isDark ? '#1E2427' : '#FFFFFF';
  const borderColor  = isDark ? '#2C3338' : '#E8ECEF';
  const textPrimary  = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#687076';

  const isLive        = match.status === 'live';
  const isTeam1Winner = !isLive && match.winner === match.team1.short;
  const isTeam2Winner = !isLive && match.winner === match.team2.short;

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/cricket/match/${match.id}`)}
      style={[styles.card, { backgroundColor: cardBg, borderColor }, isLive && { borderColor: 'rgba(239,68,68,0.4)' }]}
    >
      {/* Header */}
      <View style={styles.matchHeader}>
        <Text style={[styles.matchMeta, { color: textSecondary }]} numberOfLines={1}>
          {typeof match.matchNumber === 'number' ? `Match ${match.matchNumber}` : match.matchNumber}
          {' · '}{match.format}{' · '}{match.venue}
        </Text>
        <View style={styles.matchHeaderRight}>
          {isLive ? (
            <View style={styles.liveChip}>
              <View style={styles.liveChipDot} />
              <Text style={styles.liveChipText}>LIVE</Text>
            </View>
          ) : (
            <Text style={[styles.matchDate, { color: textSecondary }]}>{formatDate(match.date)}</Text>
          )}
          <Text style={[styles.chevron, { color: textSecondary }]}>›</Text>
        </View>
      </View>

      {/* Scores */}
      <View style={styles.teamsSection}>
        {match.isTest ? (
          <>
            <TestTeamRow
              name={match.team1.short}
              color={match.team1.color}
              testScore={match.innings1.testScore}
              isWinner={isTeam1Winner}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
            <TestTeamRow
              name={match.team2.short}
              color={match.team2.color}
              testScore={match.innings2.testScore}
              isWinner={isTeam2Winner}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          </>
        ) : (
          <>
            <TeamScoreRow
              name={match.team1.short}
              color={match.team1.color}
              innings={match.innings1}
              isWinner={isTeam1Winner}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
            <View style={[styles.divider, { backgroundColor: borderColor }]} />
            <TeamScoreRow
              name={match.team2.short}
              color={match.team2.color}
              innings={match.innings2}
              isWinner={isTeam2Winner}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          </>
        )}
      </View>

      {/* Footer */}
      {isLive ? (
        <View style={[styles.liveFooter, { borderTopColor: borderColor }]}>
          <View style={styles.liveFooterLeft}>
            <View style={styles.liveFooterDot} />
            <Text style={styles.liveFooterStatus}>In Progress · Innings 2</Text>
          </View>
          {match.liveData && (
            <Text style={[styles.liveFooterTarget, { color: textSecondary }]}>
              Need {match.liveData.runsNeeded} off {match.liveData.ballsRemaining} balls
            </Text>
          )}
        </View>
      ) : (
        <View style={[styles.resultFooter, { borderTopColor: borderColor }]}>
          <Text style={styles.resultText}>{match.result}</Text>
          {match.manOfMatch && (
            <Text style={[styles.momText, { color: textSecondary }]}>MoM: {match.manOfMatch}</Text>
          )}
        </View>
      )}

      {/* Match summary — completed non-Test matches with scorecard data */}
      {!isLive && !match.isTest && match.innings1?.batting && match.innings2?.batting && (
        <MatchSummary
          innings1={match.innings1}
          innings2={match.innings2}
          team1={match.team1}
          team2={match.team2}
          borderColor={borderColor}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
      )}

      {/* Optional highlight / note */}
      {(match.highlight || match.note || match.seriesResult) && (
        <View style={[styles.noteRow, { borderTopColor: borderColor }]}>
          <Text style={[styles.noteText, { color: textSecondary }]} numberOfLines={2}>
            {match.highlight || match.seriesResult || match.note}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

function MatchSummary({ innings1, innings2, team1, team2, borderColor, textPrimary, textSecondary }) {
  const lastName = n => n.split(' ').slice(-1)[0];

  const topBat = arr =>
    [...arr].sort((a, b) => b.runs - a.runs).slice(0, 2);

  const topBowl = arr => {
    const wkts = [...arr].filter(b => b.wickets > 0).sort((a, b) => b.wickets - a.wickets || a.economy - b.economy);
    return wkts.length > 0 ? wkts.slice(0, 2) : [...arr].sort((a, b) => a.economy - b.economy).slice(0, 1);
  };

  const bat1   = topBat(innings1.batting);
  const bowl1  = topBowl(innings1.bowling);   // team2 bowled to team1
  const bat2   = topBat(innings2.batting);
  const bowl2  = topBowl(innings2.bowling);   // team1 bowled to team2

  return (
    <View style={[styles.summary, { borderTopColor: borderColor }]}>
      <Text style={[styles.summaryHeading, { color: textSecondary }]}>KEY PERFORMANCES</Text>

      {/* Innings 1 row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryHalf}>
          <Text style={[styles.summaryTeamTag, { color: team1.color }]}>{team1.short} bat</Text>
          {bat1.map((b, i) => (
            <Text key={i} style={[styles.summaryLine, { color: textPrimary }]}>
              {lastName(b.playerName)}{' '}
              <Text style={styles.summaryScore}>
                {b.runs}{b.dismissal === 'not out' ? '*' : ''} ({b.balls})
              </Text>
            </Text>
          ))}
        </View>
        <View style={[styles.summaryDividerV, { backgroundColor: borderColor }]} />
        <View style={styles.summaryHalf}>
          <Text style={[styles.summaryTeamTag, { color: team2.color }]}>{team2.short} bowl</Text>
          {bowl1.map((b, i) => (
            <Text key={i} style={[styles.summaryLine, { color: textPrimary }]}>
              {lastName(b.playerName)}{' '}
              <Text style={styles.summaryScore}>{b.wickets}/{b.runs}</Text>
            </Text>
          ))}
        </View>
      </View>

      <View style={[styles.summaryDividerH, { backgroundColor: borderColor }]} />

      {/* Innings 2 row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryHalf}>
          <Text style={[styles.summaryTeamTag, { color: team2.color }]}>{team2.short} bat</Text>
          {bat2.map((b, i) => (
            <Text key={i} style={[styles.summaryLine, { color: textPrimary }]}>
              {lastName(b.playerName)}{' '}
              <Text style={styles.summaryScore}>
                {b.runs}{b.dismissal === 'not out' ? '*' : ''} ({b.balls})
              </Text>
            </Text>
          ))}
        </View>
        <View style={[styles.summaryDividerV, { backgroundColor: borderColor }]} />
        <View style={styles.summaryHalf}>
          <Text style={[styles.summaryTeamTag, { color: team1.color }]}>{team1.short} bowl</Text>
          {bowl2.map((b, i) => (
            <Text key={i} style={[styles.summaryLine, { color: textPrimary }]}>
              {lastName(b.playerName)}{' '}
              <Text style={styles.summaryScore}>{b.wickets}/{b.runs}</Text>
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
}

function TeamScoreRow({ name, color, innings, isWinner, textPrimary, textSecondary }) {
  return (
    <View style={styles.teamRow}>
      <View style={styles.teamLeft}>
        <View style={[styles.teamBadge, { backgroundColor: color }]}>
          <Text style={styles.teamBadgeText}>{name}</Text>
        </View>
        <Text style={[styles.teamName, { color: textPrimary }, isWinner && styles.winnerName]}>
          {name}
        </Text>
        {isWinner && <Text style={styles.winnerChip}>Won</Text>}
      </View>
      {innings ? (
        <Text style={[styles.score, { color: textPrimary }, isWinner && styles.winnerScore]}>
          {innings.totalRuns}/{innings.wickets}
          <Text style={[styles.oversText, { color: textSecondary }]}> ({innings.overs})</Text>
        </Text>
      ) : (
        <Text style={[styles.score, { color: textSecondary }]}>- / -</Text>
      )}
    </View>
  );
}

function TestTeamRow({ name, color, testScore, isWinner, textPrimary, textSecondary }) {
  return (
    <View style={styles.teamRow}>
      <View style={styles.teamLeft}>
        <View style={[styles.teamBadge, { backgroundColor: color }]}>
          <Text style={styles.teamBadgeText}>{name}</Text>
        </View>
        <Text style={[styles.teamName, { color: textPrimary }, isWinner && styles.winnerName]}>
          {name}
        </Text>
        {isWinner && <Text style={styles.winnerChip}>Won</Text>}
      </View>
      <Text
        style={[styles.testScore, { color: isWinner ? textPrimary : textSecondary },
          isWinner && styles.winnerScore]}
        numberOfLines={1}
      >
        {testScore}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
  },
  matchMeta: { fontSize: 12, flex: 1, marginRight: 8 },
  matchHeaderRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  matchDate: { fontSize: 12 },
  chevron: { fontSize: 18, lineHeight: 22 },
  teamsSection: { paddingHorizontal: 16 },
  teamRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8 },
  teamLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  teamBadge: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  teamBadgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: -0.5 },
  teamName: { fontSize: 16, fontWeight: '500' },
  winnerName: { fontWeight: '700' },
  winnerChip: {
    backgroundColor: '#27AE60',
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  score: { fontSize: 18, fontWeight: '600' },
  testScore: { fontSize: 15, fontWeight: '600' },
  winnerScore: { fontWeight: '700' },
  oversText: { fontSize: 13, fontWeight: '400' },
  divider: { height: 1 },
  resultFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 4,
    borderTopWidth: 1,
    backgroundColor: 'rgba(39, 174, 96, 0.08)',
  },
  resultText: { color: '#27AE60', fontSize: 13, fontWeight: '600' },
  momText: { fontSize: 12 },
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  liveChipDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#EF4444' },
  liveChipText: { color: '#EF4444', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  liveFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, marginTop: 4, borderTopWidth: 1, backgroundColor: 'rgba(239,68,68,0.04)' },
  liveFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveFooterDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveFooterStatus: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
  liveFooterTarget: { fontSize: 12 },
  noteRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  noteText: { fontSize: 11, fontStyle: 'italic' },

  // Match summary
  summary: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  summaryHeading: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 10,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 0,
  },
  summaryHalf: {
    flex: 1,
    paddingHorizontal: 4,
    gap: 4,
  },
  summaryTeamTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  summaryLine: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryScore: {
    fontWeight: '700',
  },
  summaryDividerV: {
    width: 1,
    marginHorizontal: 6,
    marginVertical: 2,
  },
  summaryDividerH: {
    height: 1,
    marginVertical: 10,
  },
});
