import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
  ActivityIndicator, Modal, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useCricketData } from '@/hooks/use-cricket-data';
import { getTeamStats, getH2H } from '@/services/cricket-api';
import { MatchCard } from '@/components/cricket/match-card';
import { getTeamColor, getTeamAbbr, INTERNATIONAL_TEAMS, ALL_TEAMS } from '@/constants/teams';

const TEAM_FORMATS = ['ALL', 'TEST', 'ODI', 'T20I', 'T20', 'IPL'];

export default function TeamDetailScreen() {
  const { name } = useLocalSearchParams();
  const teamName = decodeURIComponent(String(name));
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const [format, setFormat] = useState('ALL');
  const [opponent, setOpponent] = useState(null);
  const [h2hFormat, setH2hFormat] = useState('ALL');
  const [opponentModalVisible, setOpponentModalVisible] = useState(false);

  const color = getTeamColor(teamName);
  const abbr = getTeamAbbr(teamName);
  const isInternational = INTERNATIONAL_TEAMS.includes(teamName);

  const bg          = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg      = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  const { data: tsData, loading: tsLoading } = useCricketData(
    () => getTeamStats(teamName, format === 'ALL' ? null : format),
    [teamName, format],
  );

  const { data: h2hResult, loading: h2hLoading } = useCricketData(
    () => opponent
      ? getH2H(teamName, opponent, h2hFormat === 'ALL' ? null : h2hFormat)
      : Promise.resolve(null),
    [opponent, h2hFormat],
  );

  const stats = {
    played:   tsData?.played   ?? 0,
    wins:     tsData?.wins     ?? 0,
    losses:   tsData?.losses   ?? 0,
    noResult: tsData?.noResult ?? 0,
    winRate:  tsData?.winRate  ?? '0.0',
  };
  const allMatches = tsData?.matches ?? [];

  const h2h       = h2hResult?.h2h;
  const teamWins  = h2h ? (h2h[`${teamName}_wins`] ?? h2h.team1_wins ?? 0) : 0;
  const oppWins   = h2h ? (h2h[`${opponent}_wins`] ?? h2h.team2_wins ?? 0) : 0;
  const h2hNR     = h2h?.no_result ?? 0;
  const h2hTotal  = h2h?.total ?? 0;
  const teamPct   = h2hTotal > 0 ? Math.round((teamWins / h2hTotal) * 100) : 0;
  const oppPct    = h2hTotal > 0 ? Math.round((oppWins  / h2hTotal) * 100) : 0;

  const opponentList = ALL_TEAMS.filter(t => t !== teamName);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: bg }]} edges={['top']}>

      {/* Nav header */}
      <View style={[styles.navHeader, { borderBottomColor: borderColor }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backText}>Cricket</Text>
        </TouchableOpacity>
        <Text style={[styles.navTitle, { color: textPrimary }]} numberOfLines={1}>{teamName}</Text>
        <View style={styles.navSpacer} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Hero card */}
        <View style={[styles.heroCard, { backgroundColor: cardBg, borderColor: `${color}55` }]}>
          <View style={[styles.heroBadge, { backgroundColor: color }]}>
            <Text style={styles.heroBadgeText}>{abbr}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.heroName, { color: textPrimary }]}>{teamName}</Text>
            <Text style={[styles.heroMeta, { color: textSecondary }]}>
              {isInternational ? 'International' : 'Franchise'} · {stats.played} matches in DB
            </Text>
          </View>
        </View>

        {/* Format filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formatBar}
        >
          {TEAM_FORMATS.map(f => {
            const active = format === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFormat(f)}
                style={[
                  styles.formatPill,
                  { backgroundColor: active ? '#1D5C33' : cardBg, borderColor: active ? '#1D5C33' : borderColor },
                ]}
              >
                <Text style={[styles.formatPillText, { color: active ? '#FFFFFF' : textSecondary }]}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {tsLoading ? (
          <ActivityIndicator size="large" color="#1D5C33" style={{ marginVertical: 48 }} />
        ) : (
          <>
            {/* Stats grid */}
            <View style={styles.statsGrid}>
              <StatCard label="Matches"  value={stats.played}             cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
              <StatCard label="Won"      value={stats.wins}    highlight   cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
              <StatCard label="Lost"     value={stats.losses}              cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
              <StatCard label="Win Rate" value={`${stats.winRate}%`} sub={`${stats.noResult} N/R`} highlight cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary} />
            </View>

            {/* Recent form */}
            {allMatches.length > 0 && (
              <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
                <View style={styles.cardHeaderRow}>
                  <Text style={[styles.cardTitle, { color: textPrimary }]}>Recent Form</Text>
                  <Text style={[styles.cardSubtitle, { color: textSecondary }]}>
                    last {Math.min(allMatches.length, 10)}
                  </Text>
                </View>
                <View style={styles.formRow}>
                  {allMatches.slice(0, 10).map((m, i) => {
                    const hasWinner = m.winner && m.winner !== '';
                    const won = hasWinner && m.winner === teamName;
                    return (
                      <View
                        key={i}
                        style={[
                          styles.formCircle,
                          { backgroundColor: !hasWinner ? '#374151' : won ? '#16A34A' : '#B91C1C' },
                        ]}
                      >
                        <Text style={styles.formCircleText}>{!hasWinner ? 'N' : won ? 'W' : 'L'}</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* H2H */}
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary, marginBottom: 12 }]}>⚔ Head-to-Head</Text>

              <TouchableOpacity
                style={[styles.opponentPicker, { borderColor, backgroundColor: isDark ? '#0D1117' : '#F7F9FC' }]}
                onPress={() => setOpponentModalVisible(true)}
              >
                <Text style={[styles.opponentPickerText, { color: opponent ? textPrimary : textSecondary }]}>
                  {opponent ?? 'Select opponent…'}
                </Text>
                <Text style={{ color: textSecondary, fontSize: 18 }}>›</Text>
              </TouchableOpacity>

              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.h2hFormatBar}>
                {TEAM_FORMATS.map(f => {
                  const active = h2hFormat === f;
                  return (
                    <TouchableOpacity
                      key={f}
                      onPress={() => setH2hFormat(f)}
                      style={[styles.h2hFormatPill, { backgroundColor: active ? '#1D5C33' : 'transparent', borderColor }]}
                    >
                      <Text style={[styles.h2hFormatText, { color: active ? '#FFFFFF' : textSecondary }]}>{f}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {!opponent && (
                <Text style={[styles.h2hEmpty, { color: textSecondary }]}>
                  Select an opponent to see head-to-head stats
                </Text>
              )}

              {opponent && h2hLoading && (
                <ActivityIndicator size="small" color="#1D5C33" style={{ marginVertical: 24 }} />
              )}

              {opponent && !h2hLoading && h2h && h2hTotal > 0 && (
                <View>
                  <View style={styles.h2hCountRow}>
                    <View style={styles.h2hTeamStat}>
                      <Text style={[styles.h2hCountValue, { color: '#22C55E' }]}>{teamWins}</Text>
                      <Text style={[styles.h2hCountLabel, { color: textSecondary }]} numberOfLines={1}>
                        {teamName.split(' ')[0]}
                      </Text>
                    </View>
                    <View style={styles.h2hTeamStat}>
                      <Text style={[styles.h2hCountValue, { color: textSecondary }]}>{h2hTotal}</Text>
                      <Text style={[styles.h2hCountLabel, { color: textSecondary }]}>Total</Text>
                    </View>
                    <View style={styles.h2hTeamStat}>
                      <Text style={[styles.h2hCountValue, { color: '#EF4444' }]}>{oppWins}</Text>
                      <Text style={[styles.h2hCountLabel, { color: textSecondary }]} numberOfLines={1}>
                        {opponent.split(' ')[0]}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.h2hBar, { backgroundColor: isDark ? '#252D38' : '#E5E7EB' }]}>
                    {teamPct > 0 && <View style={[styles.h2hBarLeft,  { width: `${teamPct}%` }]} />}
                    {oppPct  > 0 && <View style={[styles.h2hBarRight, { width: `${oppPct}%`  }]} />}
                  </View>
                  <View style={styles.h2hBarLabels}>
                    <Text style={[styles.h2hBarLabel, { color: textSecondary }]}>{teamPct}%</Text>
                    {h2hNR > 0 && <Text style={[styles.h2hBarLabel, { color: textSecondary }]}>{h2hNR} N/R</Text>}
                    <Text style={[styles.h2hBarLabel, { color: textSecondary }]}>{oppPct}%</Text>
                  </View>

                  {h2h.matches?.length > 0 && (
                    <View style={{ marginTop: 16 }}>
                      <Text style={[styles.meetingsTitle, { color: textSecondary }]}>RECENT MEETINGS</Text>
                      {h2h.matches.slice(0, 5).map((m, i) => (
                        <TouchableOpacity
                          key={i}
                          style={[styles.meetingRow, { borderTopColor: borderColor }]}
                          onPress={() => router.push(`/cricket/match/${m.id}`)}
                        >
                          <View style={{ flex: 1 }}>
                            <Text style={[styles.meetingResult, { color: textPrimary }]} numberOfLines={1}>
                              {m.result || 'No result'}
                            </Text>
                            <Text style={[styles.meetingMeta, { color: textSecondary }]}>
                              {m.date}{m.venue ? ` · ${m.venue.split(',')[0]}` : ''}
                            </Text>
                          </View>
                          <View style={[styles.meetingBadge, { backgroundColor: isDark ? '#252D38' : '#F0F2F5' }]}>
                            <Text style={[styles.meetingFormat, { color: textSecondary }]}>{m.format}</Text>
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {opponent && !h2hLoading && h2h && h2hTotal === 0 && (
                <Text style={[styles.h2hEmpty, { color: textSecondary }]}>
                  No matches found between these teams
                </Text>
              )}
            </View>

            {/* Recent matches */}
            <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recent Matches</Text>
            {allMatches.length === 0 ? (
              <Text style={[styles.emptyText, { color: textSecondary }]}>No match records found</Text>
            ) : (
              allMatches.slice(0, 15).map(m => <MatchCard key={m.id} match={m} />)
            )}
          </>
        )}
      </ScrollView>

      {/* Opponent picker modal */}
      <Modal visible={opponentModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: cardBg }]}>
            <View style={[styles.modalHeader, { borderBottomColor: borderColor }]}>
              <Text style={[styles.modalTitle, { color: textPrimary }]}>Select Opponent</Text>
              <TouchableOpacity onPress={() => setOpponentModalVisible(false)}>
                <Text style={{ color: '#4ADE80', fontWeight: '600', fontSize: 16 }}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={opponentList}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalItem,
                    { borderBottomColor: borderColor },
                    opponent === item && { backgroundColor: isDark ? '#1D5C3344' : '#DCFCE7' },
                  ]}
                  onPress={() => { setOpponent(item); setOpponentModalVisible(false); }}
                >
                  <View style={[styles.modalItemBadge, { backgroundColor: getTeamColor(item) }]}>
                    <Text style={styles.modalItemBadgeText}>{getTeamAbbr(item)}</Text>
                  </View>
                  <Text style={[styles.modalItemText, { color: textPrimary }]}>{item}</Text>
                  {opponent === item && <Text style={{ color: '#4ADE80', fontWeight: '700' }}>✓</Text>}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, highlight, cardBg, borderColor, textPrimary, textSecondary }) {
  return (
    <View style={[styles.statCard, { backgroundColor: cardBg, borderColor }]}>
      <Text style={[styles.statValue, { color: highlight ? '#22C55E' : textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: textSecondary }]}>{label}</Text>
      {sub != null && <Text style={[styles.statSub, { color: textSecondary }]}>{sub}</Text>}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  navHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1,
  },
  backBtn:   { flexDirection: 'row', alignItems: 'center', gap: 2, minWidth: 72 },
  backIcon:  { color: '#4ADE80', fontSize: 26, lineHeight: 28 },
  backText:  { color: '#4ADE80', fontWeight: '600', fontSize: 15 },
  navTitle:  { flex: 1, textAlign: 'center', fontWeight: '700', fontSize: 17 },
  navSpacer: { minWidth: 72 },

  scrollContent: { padding: 16, paddingBottom: 48 },

  heroCard: {
    flexDirection: 'row', alignItems: 'center', gap: 16,
    padding: 20, borderRadius: 16, borderWidth: 1, marginBottom: 16,
  },
  heroBadge:     { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center' },
  heroBadgeText: { color: '#FFFFFF', fontSize: 20, fontWeight: '800' },
  heroName:      { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  heroMeta:      { fontSize: 13 },

  formatBar:      { paddingBottom: 16, gap: 8, flexDirection: 'row' },
  formatPill:     { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  formatPillText: { fontSize: 13, fontWeight: '600' },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 16 },
  statCard:  { flex: 1, minWidth: '45%', borderRadius: 14, borderWidth: 1, padding: 16, alignItems: 'center' },
  statValue: { fontSize: 28, fontWeight: '800', marginBottom: 4 },
  statLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  statSub:   { fontSize: 11, marginTop: 2 },

  card:          { borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16 },
  cardHeaderRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginBottom: 12 },
  cardTitle:     { fontSize: 16, fontWeight: '700' },
  cardSubtitle:  { fontSize: 12 },
  sectionTitle:  { fontSize: 17, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  emptyText:     { textAlign: 'center', fontSize: 14, paddingVertical: 24 },

  formRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  formCircle:     { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  formCircleText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  opponentPicker:     {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 10,
  },
  opponentPickerText: { fontSize: 14 },
  h2hFormatBar:  { gap: 6, flexDirection: 'row', marginBottom: 12 },
  h2hFormatPill: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 14, borderWidth: 1 },
  h2hFormatText: { fontSize: 12, fontWeight: '600' },
  h2hEmpty:      { textAlign: 'center', fontSize: 13, paddingVertical: 16 },

  h2hCountRow:   { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 14 },
  h2hTeamStat:   { alignItems: 'center', flex: 1 },
  h2hCountValue: { fontSize: 28, fontWeight: '800' },
  h2hCountLabel: { fontSize: 12, marginTop: 4, textAlign: 'center' },

  h2hBar:       { height: 10, borderRadius: 5, flexDirection: 'row', overflow: 'hidden', marginBottom: 6 },
  h2hBarLeft:   { height: '100%', backgroundColor: '#16A34A', borderRadius: 5 },
  h2hBarRight:  { height: '100%', backgroundColor: '#DC2626', borderRadius: 5, marginLeft: 'auto' },
  h2hBarLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  h2hBarLabel:  { fontSize: 11 },

  meetingsTitle: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginBottom: 6 },
  meetingRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderTopWidth: 1, gap: 10 },
  meetingResult: { fontSize: 13, fontWeight: '500', marginBottom: 2 },
  meetingMeta:   { fontSize: 11 },
  meetingBadge:  { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  meetingFormat: { fontSize: 11, fontWeight: '600' },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modalSheet:   { borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: '75%' },
  modalHeader:  {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: 20, borderBottomWidth: 1,
  },
  modalTitle:        { fontSize: 17, fontWeight: '700' },
  modalItem:         {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1,
  },
  modalItemBadge:     { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  modalItemBadgeText: { color: '#FFFFFF', fontSize: 9, fontWeight: '800', letterSpacing: -0.5 },
  modalItemText:      { flex: 1, fontSize: 15, fontWeight: '500' },
});
