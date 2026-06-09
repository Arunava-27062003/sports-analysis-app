import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MatchCard } from '@/components/cricket/match-card';
import { PlayerRow } from '@/components/cricket/player-row';
import { LiveSection } from '@/components/cricket/live-score-card';
import { useLiveMatches } from '@/hooks/use-live-matches';
import { FORMATS, cricketData } from '@/data/cricket';

const CONTENT_TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'matches',  label: 'Matches'  },
  { id: 'players',  label: 'Players'  },
  { id: 'teams',    label: 'Rankings' },
];

export default function CricketScreen() {
  const [activeFormat, setActiveFormat]   = useState('ipl');
  const [activeTab,    setActiveTab]      = useState('overview');
  const [playerMode,   setPlayerMode]     = useState('batting');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg            = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';
  const tabBarBg      = isDark ? '#13171D' : '#FFFFFF';

  const format      = cricketData[activeFormat];
  const liveApi     = useLiveMatches();
  const batsmen     = format.players.filter(p => p.batting.innings > 0).sort((a, b) => b.batting.runs - a.batting.runs);
  const bowlers     = format.players.filter(p => p.bowling.wickets > 0).sort((a, b) => b.bowling.wickets - a.bowling.wickets);

  function handleFormatChange(id) {
    setActiveFormat(id);
    setActiveTab('overview');
    setPlayerMode('batting');
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>
      {/* ── Header ── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cricket Analysis</Text>
          <Text style={styles.headerSubtitle}>{format.subtitle}</Text>
        </View>
        {liveApi.matches.length > 0 && (
          <View style={styles.liveContainer}>
            <View style={styles.liveDot} />
            <Text style={styles.liveLabel}>
              LIVE{liveApi.matches.length > 1 ? ` · ${liveApi.matches.length}` : ''}
            </Text>
          </View>
        )}
      </View>

      {/* ── Format selector ── */}
      <View style={styles.formatBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.formatBar}
        >
          {FORMATS.map(f => {
            const active = activeFormat === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => handleFormatChange(f.id)}
                style={[
                  styles.formatPill,
                  active
                    ? { backgroundColor: '#FFFFFF' }
                    : { backgroundColor: 'rgba(255,255,255,0.15)' },
                ]}
                activeOpacity={0.75}
              >
                <Text style={[
                  styles.formatLabel,
                  { color: active ? '#0F2D1A' : 'rgba(255,255,255,0.85)' },
                  active && styles.formatLabelActive,
                ]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Content tab bar ── */}
      <View style={[styles.tabBarWrapper, { backgroundColor: tabBarBg, borderBottomColor: borderColor }]}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBar}
        >
          {CONTENT_TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabPill, active ? styles.tabPillActive : { backgroundColor: 'transparent' }]}
              >
                <Text style={[
                  styles.tabLabel,
                  { color: active ? '#FFFFFF' : textSecondary },
                  active && styles.tabLabelActive,
                ]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Content area ── */}
      <View style={[styles.contentArea, { backgroundColor: bg }]}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          key={activeFormat}
        >
          {activeTab === 'overview' && (
            <OverviewTab
              liveApi={liveApi}
              latestMatch={format.matches[0]}
              topBatsman={batsmen[0]}
              topBowler={bowlers[0]}
              standingsPreview={format.standings.slice(0, 4)}
              formatType={format.formatType}
              teamsLabel={format.teamsLabel}
              isDark={isDark}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {activeTab === 'matches' && (
            <View>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>Recent Matches</Text>
              {format.matches.map(match => (
                <MatchCard key={match.id} match={match} />
              ))}
            </View>
          )}

          {activeTab === 'players' && (
            <PlayersTab
              batsmen={batsmen}
              bowlers={bowlers}
              mode={playerMode}
              onModeChange={setPlayerMode}
              isDark={isDark}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {activeTab === 'teams' && (
            <TeamsTab
              standings={format.standings}
              formatType={format.formatType}
              teamsLabel={format.teamsLabel}
              isDark={isDark}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

// ─── Overview Tab ─────────────────────────────────────────────────────────────

function OverviewTab({ liveApi, latestMatch, topBatsman, topBowler, standingsPreview, formatType, teamsLabel, isDark, cardBg, borderColor, textPrimary, textSecondary }) {
  const isFranchise = formatType === 'franchise';

  return (
    <View>
      {/* Real-time live matches from API */}
      <LiveSection {...liveApi} />

      <Text style={[styles.sectionTitle, { color: textPrimary }]}>Latest Match</Text>
      <MatchCard match={latestMatch} />

      <Text style={[styles.sectionTitle, { color: textPrimary }]}>Top Performers</Text>
      <View style={styles.performersRow}>
        <PerformerCard
          label="Top Scorer"
          player={topBatsman}
          statValue={String(topBatsman.batting.runs)}
          statLabel="runs"
          subStat={`Avg ${topBatsman.batting.average.toFixed(1)} · SR ${topBatsman.batting.strikeRate.toFixed(1)}`}
          accentColor="#F59E0B"
          cardBg={cardBg}
          borderColor={borderColor}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
        <PerformerCard
          label="Top Wicket-taker"
          player={topBowler}
          statValue={String(topBowler.bowling.wickets)}
          statLabel="wickets"
          subStat={`Avg ${topBowler.bowling.average.toFixed(1)} · Eco ${topBowler.bowling.economy.toFixed(1)}`}
          accentColor="#EF4444"
          cardBg={cardBg}
          borderColor={borderColor}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
      </View>

      <Text style={[styles.sectionTitle, { color: textPrimary }]}>{teamsLabel}</Text>
      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <StandingsHeader
          formatType={formatType}
          borderColor={borderColor}
          textSecondary={textSecondary}
        />
        {standingsPreview.map((team, idx) => (
          <StandingRow
            key={team.id}
            team={team}
            position={idx + 1}
            isLast={idx === standingsPreview.length - 1}
            formatType={formatType}
            showPosition
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        ))}
        <View style={[styles.viewAllRow, { borderTopColor: borderColor }]}>
          <Text style={styles.viewAllText}>Showing top 4 · View all in Rankings tab</Text>
        </View>
      </View>
    </View>
  );
}

// ─── Players Tab ──────────────────────────────────────────────────────────────

function PlayersTab({ batsmen, bowlers, mode, onModeChange, isDark, cardBg, borderColor, textPrimary, textSecondary }) {
  const players    = mode === 'batting' ? batsmen : bowlers;
  const toggleBg   = isDark ? '#1A1F26' : '#F0F2F5';

  return (
    <View>
      <View style={[styles.toggleWrapper, { backgroundColor: toggleBg, borderColor }]}>
        <TouchableOpacity
          style={[styles.toggleOption, mode === 'batting' && styles.toggleOptionActive]}
          onPress={() => onModeChange('batting')}
        >
          <Text style={[styles.toggleOptionText, { color: mode === 'batting' ? '#FFFFFF' : textSecondary }]}>
            Batting
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleOption, mode === 'bowling' && styles.toggleOptionActive]}
          onPress={() => onModeChange('bowling')}
        >
          <Text style={[styles.toggleOptionText, { color: mode === 'bowling' ? '#FFFFFF' : textSecondary }]}>
            Bowling
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.playerColHeader, { backgroundColor: isDark ? '#13171D' : '#F7F9FC', borderColor }]}>
        <Text style={[styles.colHeaderRank, { color: textSecondary }]}>#</Text>
        <Text style={[styles.colHeaderName, { color: textSecondary }]}>Player</Text>
        <View style={styles.colHeaderStats}>
          {mode === 'batting' ? (
            <>
              <Text style={[styles.colHeaderStat, { color: textSecondary }]}>Runs</Text>
              <Text style={[styles.colHeaderStat, { color: textSecondary }]}>Avg</Text>
              <Text style={[styles.colHeaderStat, { color: textSecondary }]}>SR</Text>
            </>
          ) : (
            <>
              <Text style={[styles.colHeaderStat, { color: textSecondary }]}>Wkts</Text>
              <Text style={[styles.colHeaderStat, { color: textSecondary }]}>Econ</Text>
              <Text style={[styles.colHeaderStat, { color: textSecondary }]}>Avg</Text>
            </>
          )}
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        {players.map((player, index) => (
          <PlayerRow
            key={player.id}
            player={player}
            rank={index + 1}
            mode={mode}
            isLast={index === players.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

// ─── Teams / Rankings Tab ─────────────────────────────────────────────────────

function TeamsTab({ standings, formatType, teamsLabel, isDark, cardBg, borderColor, textPrimary, textSecondary }) {
  const isFranchise = formatType === 'franchise';

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: textPrimary }]}>{teamsLabel}</Text>
      <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
        <StandingsHeader
          formatType={formatType}
          borderColor={borderColor}
          textSecondary={textSecondary}
          showPosition
        />
        {standings.map((team, idx) => (
          <StandingRow
            key={team.id}
            team={team}
            position={idx + 1}
            isLast={idx === standings.length - 1}
            formatType={formatType}
            showPosition
            textPrimary={textPrimary}
            textSecondary={textSecondary}
            borderColor={borderColor}
          />
        ))}
      </View>

      <View style={[styles.legendCard, { backgroundColor: cardBg, borderColor }]}>
        <Text style={[styles.legendTitle, { color: textPrimary }]}>Form Guide</Text>
        <View style={styles.legendRow}>
          <View style={[styles.formDot, { backgroundColor: '#27AE60' }]} />
          <Text style={[styles.legendText, { color: textSecondary }]}>Win</Text>
          <View style={[styles.formDot, { backgroundColor: '#E74C3C', marginLeft: 16 }]} />
          <Text style={[styles.legendText, { color: textSecondary }]}>Loss</Text>
        </View>
        {!isFranchise && (
          <Text style={[styles.legendSub, { color: textSecondary }]}>
            Rating points sourced from ICC official rankings
          </Text>
        )}
      </View>
    </View>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function StandingsHeader({ formatType, borderColor, textSecondary }) {
  const isFranchise = formatType === 'franchise';
  return (
    <View style={[styles.tableHeader, { borderBottomColor: borderColor }]}>
      <Text style={[styles.tableHeaderCell, { color: textSecondary, width: 28 }]}>#</Text>
      <Text style={[styles.tableHeaderCell, styles.teamCol, { color: textSecondary }]}>Team</Text>
      {isFranchise ? (
        <>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>P</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>W</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>L</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>Pts</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary, minWidth: 52 }]}>NRR</Text>
        </>
      ) : (
        <>
          <Text style={[styles.tableHeaderCell, { color: textSecondary, minWidth: 44 }]}>Rtg</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>M</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>W</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary }]}>L</Text>
          <Text style={[styles.tableHeaderCell, { color: textSecondary, minWidth: 72 }]}>Form</Text>
        </>
      )}
    </View>
  );
}

function StandingRow({ team, position, isLast, formatType, textPrimary, textSecondary, borderColor }) {
  const isFranchise     = formatType === 'franchise';
  const isQualZone      = isFranchise ? position <= 4 : position <= 3;
  const posColor        = isQualZone ? '#27AE60' : textSecondary;

  return (
    <View style={[styles.standingRow, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <Text style={[styles.standingPos, { color: posColor }]}>{position}</Text>
      <View style={styles.standingTeam}>
        <View style={[styles.standingBadge, { backgroundColor: team.color }]}>
          <Text style={styles.standingBadgeText}>{team.shortName}</Text>
        </View>
        <Text style={[styles.standingName, { color: textPrimary }]}>{team.shortName}</Text>
      </View>

      {isFranchise ? (
        <>
          <Text style={[styles.standingCell, { color: textPrimary }]}>{team.matches}</Text>
          <Text style={[styles.standingCell, { color: '#27AE60' }]}>{team.won}</Text>
          <Text style={[styles.standingCell, { color: '#E74C3C' }]}>{team.lost}</Text>
          <Text style={[styles.standingCell, styles.ptsCell, { color: textPrimary }]}>{team.points}</Text>
          <Text style={[styles.standingNRR, { color: team.nrr >= 0 ? '#27AE60' : '#E74C3C' }]}>
            {team.nrr >= 0 ? '+' : ''}{team.nrr.toFixed(3)}
          </Text>
        </>
      ) : (
        <>
          <Text style={[styles.standingRating, { color: '#F59E0B' }]}>{team.rating}</Text>
          <Text style={[styles.standingCell, { color: textPrimary }]}>{team.matches}</Text>
          <Text style={[styles.standingCell, { color: '#27AE60' }]}>{team.won}</Text>
          <Text style={[styles.standingCell, { color: '#E74C3C' }]}>{team.lost}</Text>
          <View style={styles.formContainer}>
            {team.form.slice(-5).map((result, i) => (
              <View
                key={i}
                style={[styles.formDot, { backgroundColor: result === 'W' ? '#27AE60' : '#E74C3C' }]}
              />
            ))}
          </View>
        </>
      )}
    </View>
  );
}

function PerformerCard({ label, player, statValue, statLabel, subStat, accentColor, cardBg, borderColor, textPrimary, textSecondary }) {
  const initials = player.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <View style={[styles.performerCard, { backgroundColor: cardBg, borderColor }]}>
      <Text style={[styles.performerLabel, { color: textSecondary }]}>{label}</Text>
      <View style={[styles.performerAvatar, { backgroundColor: player.teamColor }]}>
        <Text style={styles.performerAvatarText}>{initials}</Text>
      </View>
      <Text style={[styles.performerName, { color: textPrimary }]} numberOfLines={1}>{player.name}</Text>
      <Text style={[styles.performerTeam, { color: textSecondary }]}>{player.teamShort}</Text>
      <Text style={[styles.performerStatValue, { color: accentColor }]}>{statValue}</Text>
      <Text style={[styles.performerStatLabel, { color: textSecondary }]}>{statLabel}</Text>
      <Text style={[styles.performerSubStat, { color: textSecondary }]}>{subStat}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 10,
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  liveContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  liveLabel: { color: '#4ADE80', fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  // Format bar
  formatBarWrapper: { paddingBottom: 10 },
  formatBar: { paddingHorizontal: 14, gap: 8, flexDirection: 'row' },
  formatPill: { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20 },
  formatLabel: { fontSize: 13, fontWeight: '600' },
  formatLabelActive: { fontWeight: '700' },

  // Content tab bar
  tabBarWrapper: { borderBottomWidth: 1 },
  tabBar: { paddingHorizontal: 12, paddingVertical: 8, gap: 6, flexDirection: 'row' },
  tabPill: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  tabPillActive: { backgroundColor: '#1D5C33' },
  tabLabel: { fontSize: 14, fontWeight: '500' },
  tabLabelActive: { fontWeight: '600' },

  // Content
  contentArea: { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionTitle: { fontSize: 17, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },

  // Performers
  performersRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  performerCard: { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  performerLabel: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  performerAvatar: { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  performerAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  performerName: { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  performerTeam: { fontSize: 12, marginBottom: 8 },
  performerStatValue: { fontSize: 28, fontWeight: '800' },
  performerStatLabel: { fontSize: 11, marginBottom: 4 },
  performerSubStat: { fontSize: 11, textAlign: 'center', marginTop: 2 },

  // Table
  tableHeader: { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  tableHeaderCell: { fontSize: 12, fontWeight: '600', textAlign: 'center', minWidth: 28 },
  teamCol: { flex: 1, textAlign: 'left' },
  viewAllRow: { padding: 12, borderTopWidth: 1, alignItems: 'center' },
  viewAllText: { fontSize: 12, color: '#1D5C33', fontWeight: '500' },

  // Player toggles / column headers
  toggleWrapper: { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3, marginBottom: 12 },
  toggleOption: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  toggleOptionActive: { backgroundColor: '#1D5C33' },
  toggleOptionText: { fontSize: 14, fontWeight: '600' },
  playerColHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderWidth: 1,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    borderBottomWidth: 0,
    gap: 10,
  },
  colHeaderRank: { width: 20, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  colHeaderName: { flex: 1, fontSize: 11, fontWeight: '600' },
  colHeaderStats: { flexDirection: 'row', gap: 12 },
  colHeaderStat: { fontSize: 11, fontWeight: '600', minWidth: 40, textAlign: 'center' },

  // Standings rows
  standingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11 },
  standingPos: { width: 28, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  standingTeam: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  standingBadge: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  standingBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: -0.5 },
  standingName: { fontSize: 14, fontWeight: '600' },
  standingCell: { width: 28, textAlign: 'center', fontSize: 14, fontWeight: '500' },
  ptsCell: { fontWeight: '700' },
  standingNRR: { minWidth: 52, textAlign: 'right', fontSize: 13, fontWeight: '600' },
  standingRating: { minWidth: 44, textAlign: 'center', fontSize: 14, fontWeight: '700' },
  formContainer: { flexDirection: 'row', gap: 4, minWidth: 72, justifyContent: 'flex-end' },
  formDot: { width: 10, height: 10, borderRadius: 5 },

  // Legend
  legendCard: { borderRadius: 12, borderWidth: 1, padding: 14 },
  legendTitle: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  legendRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  legendText: { fontSize: 12 },
  legendSub: { fontSize: 11, marginTop: 8, fontStyle: 'italic' },
});
