import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCricketData } from '@/hooks/use-cricket-data';
import { getPlayerStats } from '@/services/cricket-api';

const PLAYER_FORMATS = ['ALL', 'TEST', 'ODI', 'T20I', 'IPL', 'T20'];

export default function PlayerDetailScreen() {
  const params = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [format, setFormat] = useState('ALL');

  const bg            = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  const name      = params.name      || 'Unknown Player';
  const teamShort = params.teamShort || '';
  const teamColor = params.teamColor || '#555';
  const role      = params.role      || 'Cricketer';
  const initials  = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  const apiFormat = format === 'ALL' ? null : format.toLowerCase();

  const { data, loading, error, reload } = useCricketData(
    () => getPlayerStats(name, apiFormat),
    [name, format],
  );

  const batting = data?.stats?.batting;
  const bowling = data?.stats?.bowling;
  const hasBatting = batting && (batting.innings > 0 || batting.total_runs > 0);
  const hasBowling = bowling && bowling.innings > 0;

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
        {/* Format selector */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[styles.formatBarOuter, { backgroundColor: isDark ? '#13171D' : '#FFFFFF', borderBottomColor: borderColor }]}
          contentContainerStyle={styles.formatBar}
        >
          {PLAYER_FORMATS.map(f => {
            const active = format === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFormat(f)}
                style={[styles.formatPill, { backgroundColor: active ? '#1D5C33' : 'transparent', borderColor: active ? '#1D5C33' : borderColor }]}
              >
                <Text style={[styles.formatPillText, { color: active ? '#FFFFFF' : textSecondary }]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
          {loading ? (
            <View style={styles.centeredBox}>
              <ActivityIndicator size="large" color="#1D5C33" />
            </View>
          ) : error ? (
            <View style={styles.centeredBox}>
              <Text style={[styles.stateText, { color: textSecondary }]}>Failed to load stats</Text>
              <TouchableOpacity onPress={reload} style={styles.retryBtn}>
                <Text style={styles.retryBtnText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              {hasBatting && (
                <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
                  <Text style={[styles.cardTitle, { color: textPrimary }]}>Batting</Text>

                  <StatRow borderColor={borderColor}>
                    <Cell label="Inns"  value={String(batting.innings ?? 0)}                                    tp={textPrimary} ts={textSecondary} />
                    <Cell label="Runs"  value={String(batting.total_runs ?? 0)}      accent="#F59E0B"           tp={textPrimary} ts={textSecondary} />
                    <Cell label="HS"    value={String(batting.high_score ?? '—')}                               tp={textPrimary} ts={textSecondary} />
                    <Cell label="Avg"   value={batting.average > 0 ? Number(batting.average).toFixed(2) : '—'} tp={textPrimary} ts={textSecondary} />
                  </StatRow>

                  <StatRow borderColor={borderColor} topBorder>
                    <Cell label="SR"   value={batting.strike_rate > 0 ? Number(batting.strike_rate).toFixed(1) : '—'} tp={textPrimary} ts={textSecondary} />
                    <Cell label="100s" value={String(batting.hundreds ?? 0)} accent="#10B981"                         tp={textPrimary} ts={textSecondary} />
                    <Cell label="50s"  value={String(batting.fifties ?? 0)}                                            tp={textPrimary} ts={textSecondary} />
                    <Cell label="4s"   value={String(batting.total_fours ?? '—')}                                      tp={textPrimary} ts={textSecondary} />
                  </StatRow>

                  <StatRow borderColor={borderColor} topBorder>
                    <Cell label="6s"   value={String(batting.total_sixes ?? '—')}                                      tp={textPrimary} ts={textSecondary} />
                    <Cell label=""     value=""                                                                          tp={textPrimary} ts={textSecondary} />
                    <Cell label=""     value=""                                                                          tp={textPrimary} ts={textSecondary} />
                    <Cell label=""     value=""                                                                          tp={textPrimary} ts={textSecondary} />
                  </StatRow>
                </View>
              )}

              {hasBowling && (
                <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
                  <Text style={[styles.cardTitle, { color: textPrimary }]}>Bowling</Text>

                  <StatRow borderColor={borderColor}>
                    <Cell label="Inns" value={String(bowling.innings ?? 0)}                                          tp={textPrimary} ts={textSecondary} />
                    <Cell label="Wkts" value={String(bowling.total_wickets ?? 0)} accent="#EF4444"                   tp={textPrimary} ts={textSecondary} />
                    <Cell label="BBI"  value={bowling.best_bowling || '—'}                                            tp={textPrimary} ts={textSecondary} />
                    <Cell label="Avg"  value={bowling.average > 0 ? Number(bowling.average).toFixed(2) : '—'}       tp={textPrimary} ts={textSecondary} />
                  </StatRow>

                  <StatRow borderColor={borderColor} topBorder>
                    <Cell label="Econ" value={bowling.economy > 0 ? Number(bowling.economy).toFixed(2) : '—'}       tp={textPrimary} ts={textSecondary} />
                    <Cell label=""     value=""                                                                        tp={textPrimary} ts={textSecondary} />
                    <Cell label=""     value=""                                                                        tp={textPrimary} ts={textSecondary} />
                    <Cell label=""     value=""                                                                        tp={textPrimary} ts={textSecondary} />
                  </StatRow>
                </View>
              )}

              {!hasBatting && !hasBowling && !loading && (
                <View style={[styles.emptyCard, { backgroundColor: cardBg, borderColor }]}>
                  <Text style={[styles.emptyText, { color: textSecondary }]}>
                    No stats available{format !== 'ALL' ? ` for ${format}` : ''}.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function StatRow({ children, borderColor, topBorder }) {
  return (
    <View style={[styles.statRow, topBorder && { borderTopWidth: 1, borderTopColor: borderColor }]}>
      {children}
    </View>
  );
}

function Cell({ label, value, accent, tp, ts }) {
  if (!label && !value) return <View style={styles.cell} />;
  return (
    <View style={styles.cell}>
      <Text style={[styles.cellValue, { color: accent ?? tp }]}>{value}</Text>
      <Text style={[styles.cellLabel, { color: ts }]}>{label}</Text>
    </View>
  );
}

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

  formatBarOuter: { borderBottomWidth: 1, flexGrow: 0 },
  formatBar: { paddingHorizontal: 12, paddingVertical: 10, gap: 6, flexDirection: 'row' },
  formatPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  formatPillText: { fontSize: 12, fontWeight: '600' },

  scroll: { padding: 14, paddingBottom: 36 },
  centeredBox: { paddingVertical: 60, alignItems: 'center', gap: 16 },
  stateText: { fontSize: 15, textAlign: 'center' },
  retryBtn: { backgroundColor: '#1D5C33', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryBtnText: { color: '#FFFFFF', fontWeight: '600', fontSize: 14 },

  card: { borderRadius: 14, borderWidth: 1, marginBottom: 12, overflow: 'hidden' },
  cardTitle: { fontSize: 15, fontWeight: '700', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },

  emptyCard: { borderRadius: 14, borderWidth: 1, padding: 32, alignItems: 'center' },
  emptyText: { fontSize: 14, textAlign: 'center' },

  statRow: { flexDirection: 'row' },
  cell: { flex: 1, paddingVertical: 14, alignItems: 'center' },
  cellValue: { fontSize: 20, fontWeight: '700' },
  cellLabel: { fontSize: 11, marginTop: 3, fontWeight: '500' },
});
