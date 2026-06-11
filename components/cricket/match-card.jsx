import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { TeamAvatar } from './team-avatar';

function formatMatchDate(dateStr) {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '';
  }
}

// Determine which team won from the result string
function getWinner(result = '', team1Name = '', team2Name = '') {
  if (!result) return null;
  const r = result.toLowerCase();
  if (r.includes(team1Name.toLowerCase())) return 'team1';
  if (r.includes(team2Name.toLowerCase())) return 'team2';
  return null;
}

export function MatchCard({ match }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg        = isDark ? '#1E2427' : '#FFFFFF';
  const borderColor   = isDark ? '#2C3338' : '#E8ECEF';
  const textPrimary   = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#687076';

  const isLive   = match.status === 'live';
  const isTest   = match.format === 'TEST';
  const winner   = getWinner(match.result || match.statusText, match.team1?.name, match.team2?.name);
  const team1Win = winner === 'team1';
  const team2Win = winner === 'team2';

  // Parse a short match label from the title (e.g. "5th Match" from "MI vs CSK, 5th Match")
  const matchLabel = (() => {
    const title = match.title || '';
    const comma = title.lastIndexOf(',');
    return comma !== -1 ? title.slice(comma + 1).trim() : match.format;
  })();

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={() => router.push(`/cricket/match/${match.id}`)}
      style={[styles.card, { backgroundColor: cardBg, borderColor }, isLive && { borderColor: 'rgba(239,68,68,0.4)' }]}
    >
      {/* Header */}
      <View style={styles.matchHeader}>
        <Text style={[styles.matchMeta, { color: textSecondary }]} numberOfLines={1}>
          {matchLabel} · {match.format} · {match.venue || match.seriesName}
        </Text>
        <View style={styles.matchHeaderRight}>
          {isLive ? (
            <View style={styles.liveChip}>
              <View style={styles.liveChipDot} />
              <Text style={styles.liveChipText}>LIVE</Text>
            </View>
          ) : (
            <Text style={[styles.matchDate, { color: textSecondary }]}>
              {formatMatchDate(match.startDate)}
            </Text>
          )}
          <Text style={[styles.chevron, { color: textSecondary }]}>›</Text>
        </View>
      </View>

      {/* Teams + scores */}
      <View style={styles.teamsSection}>
        <TeamScoreRow
          team={match.team1}
          isWinner={team1Win}
          isLive={isLive}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
        <View style={[styles.divider, { backgroundColor: borderColor }]} />
        <TeamScoreRow
          team={match.team2}
          isWinner={team2Win}
          isLive={isLive}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
      </View>

      {/* Footer */}
      {isLive ? (
        <View style={[styles.liveFooter, { borderTopColor: borderColor }]}>
          <View style={styles.liveFooterLeft}>
            <View style={styles.liveFooterDot} />
            <Text style={styles.liveFooterStatus}>{match.statusText || 'In Progress'}</Text>
          </View>
        </View>
      ) : match.result ? (
        <View style={[styles.resultFooter, { borderTopColor: borderColor }]}>
          <Text style={styles.resultText}>{match.result}</Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
}

function TeamScoreRow({ team, isWinner, isLive, textPrimary, textSecondary }) {
  if (!team) return null;
  const score = team.score;
  return (
    <View style={styles.teamRow}>
      <View style={styles.teamLeft}>
        <TeamAvatar name={team.name} size={40} />
        <Text style={[styles.teamName, { color: textPrimary }, isWinner && styles.winnerName]}>
          {team.short || team.name}
        </Text>
        {isWinner && <Text style={styles.winnerChip}>Won</Text>}
      </View>
      {score ? (
        <Text style={[styles.score, { color: textPrimary }, isWinner && styles.winnerScore]}>
          {score.runs}/{score.wickets}
          <Text style={[styles.oversText, { color: textSecondary }]}> ({score.overs})</Text>
        </Text>
      ) : (
        <Text style={[styles.score, { color: textSecondary }]}>{isLive ? '—' : 'Yet to bat'}</Text>
      )}
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
  liveChip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(239,68,68,0.1)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)' },
  liveChipDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#EF4444' },
  liveChipText: { color: '#EF4444', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  liveFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, marginTop: 4, borderTopWidth: 1, backgroundColor: 'rgba(239,68,68,0.04)' },
  liveFooterLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  liveFooterDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  liveFooterStatus: { color: '#EF4444', fontSize: 13, fontWeight: '600' },
});
