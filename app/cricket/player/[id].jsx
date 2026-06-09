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
import { findPlayerById } from '@/data/cricket';

export default function PlayerDetailScreen() {
  const { id } = useLocalSearchParams();
  const player = findPlayerById(String(id));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg            = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  if (!player) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]} edges={['top']}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={[styles.backLabel, { color: textSecondary }]}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.notFound}>
          <Text style={[styles.notFoundText, { color: textSecondary }]}>Player not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  const initials   = player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hasBatting = player.batting.innings > 0 || player.batting.runs > 0;
  const hasBowling = player.bowling.innings > 0 || player.bowling.wickets > 0;

  // ── Derived batting stats ──────────────────────────────────────────────────
  const notOuts = player.batting.average > 0 && player.batting.innings > 0
    ? Math.max(0, Math.round(player.batting.innings - player.batting.runs / player.batting.average))
    : 0;
  const ballsFaced = player.batting.strikeRate > 0 && player.batting.runs > 0
    ? Math.round(player.batting.runs * 100 / player.batting.strikeRate)
    : 0;

  // ── Derived bowling stats ──────────────────────────────────────────────────
  const totalBalls = player.bowling.economy > 0 && player.bowling.wickets > 0
    ? Math.round(6 * player.bowling.average * player.bowling.wickets / player.bowling.economy)
    : 0;
  const bowlingSR = player.bowling.economy > 0 && player.bowling.average > 0
    ? (6 * player.bowling.average / player.bowling.economy).toFixed(1)
    : '—';

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        <View style={styles.playerHero}>
          <View style={[styles.bigAvatar, { backgroundColor: player.teamColor }]}>
            <Text style={styles.bigAvatarText}>{initials}</Text>
          </View>
          <Text style={styles.playerName}>{player.name}</Text>
          <Text style={styles.playerMeta}>{player.team}</Text>
          <View style={styles.pillRow}>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{player.role}</Text>
            </View>
            <View style={styles.pill}>
              <Text style={styles.pillText}>{player.matches} matches</Text>
            </View>
            {player.formatLabel && (
              <View style={[styles.pill, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                <Text style={styles.pillText}>{player.formatLabel}</Text>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── Content ── */}
      <View style={[styles.contentArea, { backgroundColor: bg }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* ── Batting ── */}
          {hasBatting && (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Batting</Text>

              <StatRow borderColor={borderColor}>
                <Cell label="Inns"  value={String(player.batting.innings)}                  tp={textPrimary} ts={textSecondary} />
                <Cell label="NO"    value={String(notOuts)}                                  tp={textPrimary} ts={textSecondary} />
                <Cell label="Runs"  value={String(player.batting.runs)}  accent="#F59E0B"   tp={textPrimary} ts={textSecondary} />
                <Cell label="HS"    value={String(player.batting.highScore)}                 tp={textPrimary} ts={textSecondary} />
              </StatRow>

              <StatRow borderColor={borderColor} topBorder>
                <Cell label="Avg"  value={player.batting.average.toFixed(2)}                tp={textPrimary} ts={textSecondary} />
                <Cell label="BF"   value={String(ballsFaced)}                               tp={textPrimary} ts={textSecondary} />
                <Cell label="SR"   value={player.batting.strikeRate.toFixed(2)}              tp={textPrimary} ts={textSecondary} />
                <Cell label=""     value=""                                                  tp={textPrimary} ts={textSecondary} />
              </StatRow>

              <StatRow borderColor={borderColor} topBorder>
                <Cell label="100s" value={String(player.batting.hundreds)} accent="#10B981" tp={textPrimary} ts={textSecondary} />
                <Cell label="50s"  value={String(player.batting.fifties)}                   tp={textPrimary} ts={textSecondary} />
                <Cell label="0s"   value={String(player.batting.ducks ?? 0)}                tp={textPrimary} ts={textSecondary} />
                <Cell label=""     value=""                                                  tp={textPrimary} ts={textSecondary} />
              </StatRow>
            </View>
          )}

          {/* ── Bowling ── */}
          {hasBowling && (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Bowling</Text>

              <StatRow borderColor={borderColor}>
                <Cell label="Inns"  value={String(player.bowling.innings)}                  tp={textPrimary} ts={textSecondary} />
                <Cell label="Balls" value={totalBalls > 0 ? String(totalBalls) : '—'}       tp={textPrimary} ts={textSecondary} />
                <Cell label="Runs"  value={player.bowling.wickets > 0 ? String(Math.round(player.bowling.average * player.bowling.wickets)) : '—'} tp={textPrimary} ts={textSecondary} />
                <Cell label="Wkts"  value={String(player.bowling.wickets)} accent="#EF4444" tp={textPrimary} ts={textSecondary} />
              </StatRow>

              <StatRow borderColor={borderColor} topBorder>
                <Cell label="BBI"  value={player.bowling.bestBowling ?? '—'}                tp={textPrimary} ts={textSecondary} />
                <Cell label="Avg"  value={player.bowling.average > 0 ? player.bowling.average.toFixed(2) : '—'} tp={textPrimary} ts={textSecondary} />
                <Cell label="Econ" value={player.bowling.economy > 0 ? player.bowling.economy.toFixed(2) : '—'} tp={textPrimary} ts={textSecondary} />
                <Cell label="SR"   value={bowlingSR}                                         tp={textPrimary} ts={textSecondary} />
              </StatRow>

              <StatRow borderColor={borderColor} topBorder>
                <Cell label="4W" value={String(player.bowling.fourWickets ?? 0)}             tp={textPrimary} ts={textSecondary} />
                <Cell label="5W" value={String(player.bowling.fiveWickets ?? 0)}             tp={textPrimary} ts={textSecondary} />
                <Cell label=""   value=""                                                     tp={textPrimary} ts={textSecondary} />
                <Cell label=""   value=""                                                     tp={textPrimary} ts={textSecondary} />
              </StatRow>
            </View>
          )}

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── StatRow ──────────────────────────────────────────────────────────────────

function StatRow({ children, borderColor, topBorder }) {
  return (
    <View style={[
      styles.statRow,
      topBorder && { borderTopWidth: 1, borderTopColor: borderColor },
    ]}>
      {children}
    </View>
  );
}

// ── Cell ─────────────────────────────────────────────────────────────────────

function Cell({ label, value, accent, tp, ts }) {
  if (!label && !value) return <View style={styles.cell} />;
  return (
    <View style={styles.cell}>
      <Text style={[styles.cellValue, { color: accent ?? tp }]}>{value}</Text>
      <Text style={[styles.cellLabel, { color: ts }]}>{label}</Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

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
    marginBottom: 4,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)',
  },
  bigAvatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  playerName: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  playerMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' },
  pill: { backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  pillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

  scroll: { padding: 14, paddingBottom: 36 },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  notFoundText: { fontSize: 16 },

  card: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTitle: { fontSize: 15, fontWeight: '700', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },

  statRow: { flexDirection: 'row' },
  cell: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  cellValue: { fontSize: 20, fontWeight: '700' },
  cellLabel: { fontSize: 11, marginTop: 3, fontWeight: '500' },
});
