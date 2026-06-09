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
import * as WebBrowser from 'expo-web-browser';
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

  const initials    = player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const hasBatting  = player.batting.innings > 0 || player.batting.runs > 0;
  const hasBowling  = player.bowling.innings > 0 || player.bowling.wickets > 0;

  function openStatsguru() {
    const url = player.espnId
      ? `https://stats.espncricinfo.com/ci/engine/player/${player.espnId}.html`
      : `https://search.espncricinfo.com/?q=${encodeURIComponent(player.name)}`;
    WebBrowser.openBrowserAsync(url);
  }

  function openStatsguruQuery(type) {
    if (!player.espnId) { openStatsguru(); return; }
    // class=1 Test, class=2 ODI, class=3 T20I, class=6 T20 franchise
    const classMap = { ipl: 6, test: 1, odi: 2, t20i: 3 };
    const cls = classMap[player.formatKey] ?? 3;
    const url = `https://stats.espncricinfo.com/ci/engine/stats/index.html?player=${player.espnId}&class=${cls}&type=${type}`;
    WebBrowser.openBrowserAsync(url);
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backArrow}>←</Text>
          <Text style={styles.backLabel}>Back</Text>
        </TouchableOpacity>

        {/* Player hero inside green header */}
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
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
        >

          {/* Batting stats */}
          {hasBatting && (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Batting</Text>
              <View style={[styles.statGrid, { borderTopColor: borderColor }]}>
                <StatBox label="Innings"     value={String(player.batting.innings)}                       textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Runs"        value={String(player.batting.runs)}        accent="#F59E0B"  textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Average"     value={player.batting.average.toFixed(1)}                   textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Strike Rate" value={player.batting.strikeRate.toFixed(1)}                textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="100s"        value={String(player.batting.hundreds)}    accent="#10B981"  textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="50s"         value={String(player.batting.fifties)}                      textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="High Score"  value={String(player.batting.highScore)}                    textPrimary={textPrimary} textSecondary={textSecondary} />
              </View>
            </View>
          )}

          {/* Bowling stats */}
          {hasBowling && (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <Text style={[styles.cardTitle, { color: textPrimary }]}>Bowling</Text>
              <View style={[styles.statGrid, { borderTopColor: borderColor }]}>
                <StatBox label="Innings"  value={String(player.bowling.innings)}                              textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Wickets"  value={String(player.bowling.wickets)}       accent="#EF4444"       textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Economy"  value={player.bowling.economy > 0 ? player.bowling.economy.toFixed(2) : '—'} textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Average"  value={player.bowling.average > 0 ? player.bowling.average.toFixed(1) : '—'} textPrimary={textPrimary} textSecondary={textSecondary} />
                <StatBox label="Best"     value={player.bowling.bestBowling ?? '—'}                           textPrimary={textPrimary} textSecondary={textSecondary} />
              </View>
            </View>
          )}

          {/* Statsguru */}
          <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
            <Text style={[styles.cardTitle, { color: textPrimary }]}>Explore on Statsguru</Text>
            <Text style={[styles.statsguruDesc, { color: textSecondary }]}>
              Deep-dive into full career numbers — innings-by-innings logs, opposition splits, venue records, and more — powered by ESPNcricinfo Statsguru.
            </Text>

            <View style={styles.btnRow}>
              {hasBatting && (
                <TouchableOpacity
                  style={[styles.statsBtn, { borderColor }]}
                  onPress={() => openStatsguruQuery('batting')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.statsBtnLabel, { color: textSecondary }]}>Batting</Text>
                  <Text style={[styles.statsBtnPrimary, { color: textPrimary }]}>Stats ↗</Text>
                </TouchableOpacity>
              )}
              {hasBowling && (
                <TouchableOpacity
                  style={[styles.statsBtn, { borderColor }]}
                  onPress={() => openStatsguruQuery('bowling')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.statsBtnLabel, { color: textSecondary }]}>Bowling</Text>
                  <Text style={[styles.statsBtnPrimary, { color: textPrimary }]}>Stats ↗</Text>
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.profileBtn}
              onPress={openStatsguru}
              activeOpacity={0.85}
            >
              <Text style={styles.profileBtnText}>
                {player.espnId ? 'Full Player Profile on ESPNcricinfo ↗' : 'Search on ESPNcricinfo ↗'}
              </Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ── StatBox ──────────────────────────────────────────────────────────────────

function StatBox({ label, value, accent, textPrimary, textSecondary }) {
  return (
    <View style={styles.statBox}>
      <Text style={[styles.statBoxValue, { color: accent ?? textPrimary }]}>{value}</Text>
      <Text style={[styles.statBoxLabel, { color: textSecondary }]}>{label}</Text>
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  contentArea: { flex: 1 },

  // Header
  header: {
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 20,
  },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 16 },
  backArrow: { color: '#FFFFFF', fontSize: 20, lineHeight: 24 },
  backLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },

  // Player hero
  playerHero: { alignItems: 'center', gap: 6 },
  bigAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  bigAvatarText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
  playerName: { color: '#FFFFFF', fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  playerMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 14 },
  pillRow: { flexDirection: 'row', gap: 8, marginTop: 4, flexWrap: 'wrap', justifyContent: 'center' },
  pill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  pillText: { color: '#FFFFFF', fontSize: 12, fontWeight: '600' },

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
  cardTitle: { fontSize: 15, fontWeight: '700', paddingHorizontal: 14, paddingTop: 12, paddingBottom: 10 },

  // Stat grid
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderTopWidth: 1,
  },
  statBox: {
    width: '33.33%',
    paddingVertical: 14,
    alignItems: 'center',
  },
  statBoxValue: { fontSize: 22, fontWeight: '700' },
  statBoxLabel: { fontSize: 11, marginTop: 3 },

  // Statsguru
  statsguruDesc: { fontSize: 13, lineHeight: 19, paddingHorizontal: 14, paddingBottom: 14 },
  btnRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 14, marginBottom: 10 },
  statsBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  statsBtnLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 0.4 },
  statsBtnPrimary: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  profileBtn: {
    marginHorizontal: 14,
    marginBottom: 14,
    backgroundColor: '#0D3D6B',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  profileBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
});
