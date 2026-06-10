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

export default function PlayerDetailScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg          = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg      = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  const name      = params.name      || 'Unknown Player';
  const teamShort = params.teamShort || '';
  const teamColor = params.teamColor || '#555';
  const role      = params.role      || 'Cricketer';

  const batting = {
    innings:     Number(params.battingInnings     || 0),
    runs:        Number(params.battingRuns        || 0),
    balls:       Number(params.battingBalls       || 0),
    average:     Number(params.battingAverage     || 0),
    strikeRate:  Number(params.battingStrikeRate  || 0),
    highScore:   Number(params.battingHighScore   || 0),
    hundreds:    Number(params.battingHundreds    || 0),
    fifties:     Number(params.battingFifties     || 0),
  };

  const bowling = {
    innings:  Number(params.bowlingInnings  || 0),
    wickets:  Number(params.bowlingWickets  || 0),
    economy:  Number(params.bowlingEconomy  || 0),
    average:  Number(params.bowlingAverage  || 0),
    best:     params.bowlingBest || '',
  };

  const hasBatting = batting.runs > 0 || batting.innings > 0;
  const hasBowling = bowling.wickets > 0 || bowling.innings > 0;
  const initials   = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        <View style={styles.playerHero}>
          <View style={[styles.bigAvatar, { backgroundColor: teamColor }]}>
            <Text style={styles.bigAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.playerName}>{name}</Text>
          <Text style={styles.playerMeta}>{teamShort}</Text>
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{role}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Content */}
      <View style={[styles.contentArea, { backgroundColor: bg }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Batting */}
          {hasBatting && (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Batting</Text>

              <StatRow borderColor={borderColor}>
                <Cell label="Inns"  value={String(batting.innings)}                                  tp={textPrimary} ts={textSecondary} />
                <Cell label="Runs"  value={String(batting.runs)}       accent="#F59E0B"              tp={textPrimary} ts={textSecondary} />
                <Cell label="HS"    value={String(batting.highScore)}                                tp={textPrimary} ts={textSecondary} />
                <Cell label="Balls" value={batting.balls > 0 ? String(batting.balls) : '—'}         tp={textPrimary} ts={textSecondary} />
              </StatRow>

              <StatRow borderColor={borderColor} topBorder>
                <Cell label="Avg"  value={batting.average > 0 ? batting.average.toFixed(2) : '—'}   tp={textPrimary} ts={textSecondary} />
                <Cell label="SR"   value={batting.strikeRate > 0 ? batting.strikeRate.toFixed(2) : '—'} tp={textPrimary} ts={textSecondary} />
                <Cell label="100s" value={String(batting.hundreds)} accent="#10B981"                 tp={textPrimary} ts={textSecondary} />
                <Cell label="50s"  value={String(batting.fifties)}                                   tp={textPrimary} ts={textSecondary} />
              </StatRow>
            </View>
          )}

          {/* Bowling */}
          {hasBowling && (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Bowling</Text>

              <StatRow borderColor={borderColor}>
                <Cell label="Inns" value={String(bowling.innings)}                                    tp={textPrimary} ts={textSecondary} />
                <Cell label="Wkts" value={String(bowling.wickets)} accent="#EF4444"                   tp={textPrimary} ts={textSecondary} />
                <Cell label="BBI"  value={bowling.best || '—'}                                        tp={textPrimary} ts={textSecondary} />
                <Cell label=""     value=""                                                             tp={textPrimary} ts={textSecondary} />
              </StatRow>

              <StatRow borderColor={borderColor} topBorder>
                <Cell label="Avg"  value={bowling.average > 0 ? bowling.average.toFixed(2) : '—'}    tp={textPrimary} ts={textSecondary} />
                <Cell label="Econ" value={bowling.economy > 0 ? bowling.economy.toFixed(2) : '—'}    tp={textPrimary} ts={textSecondary} />
                <Cell label=""     value=""                                                             tp={textPrimary} ts={textSecondary} />
                <Cell label=""     value=""                                                             tp={textPrimary} ts={textSecondary} />
              </StatRow>
            </View>
          )}

          {!hasBatting && !hasBowling && (
            <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.emptyText, { color: textSecondary }]}>No stats available for this player.</Text>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── StatRow ───────────────────────────────────────────────────────────────────

function StatRow({ children, borderColor, topBorder }) {
  return (
    <View style={[styles.statRow, topBorder && { borderTopWidth: 1, borderTopColor: borderColor }]}>
      {children}
    </View>
  );
}

// ── Cell ──────────────────────────────────────────────────────────────────────

function Cell({ label, value, accent, tp, ts }) {
  if (!label && !value) return <View style={styles.cell} />;
  return (
    <View style={styles.cell}>
      <Text style={[styles.cellValue, { color: accent ?? tp }]}>{value}</Text>
      <Text style={[styles.cellLabel, { color: ts }]}>{label}</Text>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentArea: { flex: 1 },

  header: { paddingHorizontal: 16, paddingTop: 4, paddingBottom: 20 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backArrow: { color: '#FFFFFF', fontSize: 20, lineHeight: 24 },
  backLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  playerHero: { alignItems: 'center', gap: 6 },
  bigAvatar: {
    width: 72, height: 72, borderRadius: 36,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 4, borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  bigAvatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  playerName: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  playerMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' },
  pill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  scroll: { padding: 14, paddingBottom: 36 },

  card: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTitle: { fontSize: 15, fontWeight: '700', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },

  emptyCard: { borderRadius: 14, borderWidth: 1, padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center' },

  statRow: { flexDirection: 'row' },
  cell: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  cellValue: { fontSize: 20, fontWeight: '700' },
  cellLabel: { fontSize: 11, marginTop: 3, fontWeight: '500' },
});
