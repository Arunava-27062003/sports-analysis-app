import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MatchCard } from '@/components/cricket/match-card';
import { PlayerRow } from '@/components/cricket/player-row';
import { LiveSection } from '@/components/cricket/live-score-card';
import { useLiveMatches } from '@/hooks/use-live-matches';
import { useCricketData } from '@/hooks/use-cricket-data';
import {
  getRecentMatches, getUpcomingMatches, getTopPlayers, getCricketRankings,
} from '@/services/cricket-api';
import { buildTeamList, getTeamColor } from '@/constants/teams';

// ─── Constants ────────────────────────────────────────────────────────────────

const FORMATS = [
  { id: 'ipl',  label: 'IPL'         },
  { id: 't20i', label: 'T20I'        },
  { id: 'odi',  label: 'ODI'         },
  { id: 'test', label: 'Test'        },
  { id: 't20',  label: 'T20 Leagues' },
];

const FORMAT_META = {
  ipl:  { subtitle: 'Indian Premier League',         hasRankings: false, rankLabel: null   },
  test: { subtitle: 'Test Cricket',                  hasRankings: true,  rankLabel: 'test' },
  odi:  { subtitle: 'One Day Internationals',        hasRankings: true,  rankLabel: 'odi'  },
  t20i: { subtitle: 'T20 Internationals',            hasRankings: true,  rankLabel: 't20i' },
  t20:  { subtitle: 'T20 Leagues (BBL, PSL, CPL…)', hasRankings: false, rankLabel: null   },
};

const CONTENT_TABS = [
  { id: 'overview',  label: 'Overview'  },
  { id: 'matches',   label: 'Matches'   },
  { id: 'players',   label: 'Players'   },
  { id: 'teams',     label: 'Teams'     },
  { id: 'rankings',  label: 'Rankings'  },
];

// ─── Main screen ──────────────────────────────────────────────────────────────

export default function CricketScreen() {
  const [activeFormat, setActiveFormat] = useState('ipl');
  const [activeTab,    setActiveTab]    = useState('overview');
  const [playerMode,   setPlayerMode]   = useState('batting');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg            = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';
  const tabBarBg      = isDark ? '#13171D' : '#FFFFFF';

  const meta    = FORMAT_META[activeFormat];
  const liveApi = useLiveMatches();

  const {
    data: recentMatches, loading: matchesLoading, error: matchesError, reload: reloadMatches,
  } = useCricketData(() => getRecentMatches(activeFormat), [activeFormat]);

  const {
    data: upcomingMatches, loading: upcomingLoading, error: upcomingError, reload: reloadUpcoming,
  } = useCricketData(() => getUpcomingMatches(activeFormat), [activeFormat]);

  const {
    data: playersData, loading: playersLoading, error: playersError, reload: reloadPlayers,
  } = useCricketData(() => getTopPlayers(activeFormat), [activeFormat]);

  const {
    data: rankingsData, loading: rankingsLoading,
  } = useCricketData(
    () => meta.hasRankings
      ? getCricketRankings(activeFormat)
      : Promise.resolve({ format: activeFormat, teams: [] }),
    [activeFormat],
  );

  function handleFormatChange(id) {
    setActiveFormat(id);
    setActiveTab('overview');
    setPlayerMode('batting');
  }

  const safeMatches   = recentMatches   ?? [];
  const safeUpcoming  = upcomingMatches ?? [];
  const safePlayers   = playersData     ?? { batting: [], bowling: [] };
  const safeRankings  = rankingsData    ?? { teams: [] };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Cricket Analysis</Text>
          <Text style={styles.headerSubtitle}>{meta.subtitle}</Text>
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

      {/* Format selector */}
      <View style={styles.formatBarWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.formatBar}>
          {FORMATS.map(f => {
            const active = activeFormat === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => handleFormatChange(f.id)}
                style={[styles.formatPill, active ? { backgroundColor: '#FFFFFF' } : { backgroundColor: 'rgba(255,255,255,0.15)' }]}
                activeOpacity={0.75}
              >
                <Text style={[styles.formatLabel, { color: active ? '#0F2D1A' : 'rgba(255,255,255,0.85)' }, active && styles.formatLabelActive]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content tab bar */}
      <View style={[styles.tabBarWrapper, { backgroundColor: tabBarBg, borderBottomColor: borderColor }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabBar}>
          {CONTENT_TABS.map(tab => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id)}
                style={[styles.tabPill, active ? styles.tabPillActive : { backgroundColor: 'transparent' }]}
              >
                <Text style={[styles.tabLabel, { color: active ? '#FFFFFF' : textSecondary }, active && styles.tabLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <View style={[styles.contentArea, { backgroundColor: bg }]}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} key={activeFormat}>

          {activeTab === 'overview' && (
            <OverviewTab
              liveApi={liveApi}
              latestMatch={safeMatches[0] ?? null}
              matchesLoading={matchesLoading}
              topBatsman={safePlayers.batting[0] ?? null}
              topBowler={safePlayers.bowling[0] ?? null}
              playersLoading={playersLoading}
              standingsPreview={(safeRankings.teams ?? []).slice(0, 4)}
              rankingsLoading={rankingsLoading}
              hasRankings={meta.hasRankings}
              isDark={isDark}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {activeTab === 'matches' && (
            <MatchesTab
              recentMatches={safeMatches}
              upcomingMatches={safeUpcoming}
              recentLoading={matchesLoading}
              upcomingLoading={upcomingLoading}
              recentError={matchesError}
              upcomingError={upcomingError}
              reloadRecent={reloadMatches}
              reloadUpcoming={reloadUpcoming}
              isDark={isDark}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {activeTab === 'players' && (
            <PlayersTab
              playersData={safePlayers}
              loading={playersLoading}
              error={playersError}
              onReload={reloadPlayers}
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
            <TeamsGridTab
              activeFormat={activeFormat}
              isDark={isDark}
              cardBg={cardBg}
              borderColor={borderColor}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
            />
          )}

          {activeTab === 'rankings' && (
            <RankingsTab
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

function OverviewTab({
  liveApi, latestMatch, matchesLoading, topBatsman, topBowler, playersLoading,
  standingsPreview, rankingsLoading, hasRankings,
  isDark, cardBg, borderColor, textPrimary, textSecondary,
}) {
  return (
    <View>
      <LiveSection {...liveApi} />

      <Text style={[styles.sectionTitle, { color: textPrimary }]}>Latest Match</Text>
      {matchesLoading ? (
        <LoadingCard cardBg={cardBg} borderColor={borderColor} />
      ) : latestMatch ? (
        <MatchCard match={latestMatch} />
      ) : (
        <EmptyCard message="No recent matches available" cardBg={cardBg} borderColor={borderColor} textSecondary={textSecondary} />
      )}

      <Text style={[styles.sectionTitle, { color: textPrimary }]}>Top Performers</Text>
      {playersLoading ? (
        <LoadingCard cardBg={cardBg} borderColor={borderColor} />
      ) : (topBatsman || topBowler) ? (
        <View style={styles.performersRow}>
          {topBatsman && (
            <PerformerCard
              label="Top Scorer"
              player={topBatsman}
              statValue={String(topBatsman.batting.runs)}
              statLabel="runs"
              subStat={`Avg ${(topBatsman.batting.average || 0).toFixed(1)} · SR ${(topBatsman.batting.strikeRate || 0).toFixed(1)}`}
              accentColor="#F59E0B"
              cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary}
            />
          )}
          {topBowler && (
            <PerformerCard
              label="Top Wicket-taker"
              player={topBowler}
              statValue={String(topBowler.bowling.wickets)}
              statLabel="wickets"
              subStat={`Avg ${(topBowler.bowling.average || 0).toFixed(1)} · Eco ${(topBowler.bowling.economy || 0).toFixed(1)}`}
              accentColor="#EF4444"
              cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} textSecondary={textSecondary}
            />
          )}
        </View>
      ) : (
        <EmptyCard message="Player data unavailable" cardBg={cardBg} borderColor={borderColor} textSecondary={textSecondary} />
      )}

      {hasRankings && (
        <>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>ICC Rankings</Text>
          {rankingsLoading ? (
            <LoadingCard cardBg={cardBg} borderColor={borderColor} />
          ) : standingsPreview.length > 0 ? (
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              <RankingsTableHeader borderColor={borderColor} textSecondary={textSecondary} />
              {standingsPreview.map((team, idx) => (
                <RankingRow
                  key={team.rank ?? idx}
                  team={team}
                  isLast={idx === standingsPreview.length - 1}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  borderColor={borderColor}
                />
              ))}
              <View style={[styles.viewAllRow, { borderTopColor: borderColor }]}>
                <Text style={styles.viewAllText}>Showing top 4 · View all in Rankings tab</Text>
              </View>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}

// ─── Matches Tab ──────────────────────────────────────────────────────────────

function MatchesTab({
  recentMatches, upcomingMatches, recentLoading, upcomingLoading,
  recentError, upcomingError, reloadRecent, reloadUpcoming,
  isDark, cardBg, borderColor, textPrimary, textSecondary,
}) {
  const [view, setView] = useState('recent');

  const matches = view === 'recent' ? recentMatches : upcomingMatches;
  const loading = view === 'recent' ? recentLoading : upcomingLoading;
  const error   = view === 'recent' ? recentError   : upcomingError;
  const onReload = view === 'recent' ? reloadRecent : reloadUpcoming;

  return (
    <View>
      <View style={styles.viewToggleRow}>
        {['recent', 'upcoming'].map(v => {
          const active = view === v;
          return (
            <TouchableOpacity
              key={v}
              onPress={() => setView(v)}
              style={[styles.viewTogglePill, {
                backgroundColor: active ? '#1D5C33' : cardBg,
                borderColor: active ? '#1D5C33' : borderColor,
              }]}
            >
              <Text style={[styles.viewToggleText, { color: active ? '#FFFFFF' : textSecondary }]}>
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <LoadingPlaceholder />
      ) : error ? (
        <ErrorPlaceholder error={error} onRetry={onReload} textSecondary={textSecondary} />
      ) : matches.length === 0 ? (
        <EmptyPlaceholder message={`No ${view} matches found`} textSecondary={textSecondary} />
      ) : (
        <View>
          <Text style={[styles.sectionTitle, { color: textPrimary }]}>
            {view === 'recent' ? 'Recent Matches' : 'Upcoming Matches'}
          </Text>
          {matches.map(match => <MatchCard key={match.id} match={match} />)}
        </View>
      )}
    </View>
  );
}

// ─── Players Tab ──────────────────────────────────────────────────────────────

function PlayersTab({ playersData, loading, error, onReload, mode, onModeChange, isDark, cardBg, borderColor, textPrimary, textSecondary }) {
  if (loading) return <LoadingPlaceholder />;
  if (error)   return <ErrorPlaceholder error={error} onRetry={onReload} textSecondary={textSecondary} />;

  const players   = mode === 'batting' ? (playersData.batting || []) : (playersData.bowling || []);
  const toggleBg  = isDark ? '#1A1F26' : '#F0F2F5';

  return (
    <View>
      {playersData.isMatchPerformance && playersData.matchTitle ? (
        <Text style={[styles.matchSourceLabel, { color: textSecondary }]}>From: {playersData.matchTitle}</Text>
      ) : null}

      <View style={[styles.toggleWrapper, { backgroundColor: toggleBg, borderColor }]}>
        <TouchableOpacity style={[styles.toggleOption, mode === 'batting' && styles.toggleOptionActive]} onPress={() => onModeChange('batting')}>
          <Text style={[styles.toggleOptionText, { color: mode === 'batting' ? '#FFFFFF' : textSecondary }]}>Batting</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.toggleOption, mode === 'bowling' && styles.toggleOptionActive]} onPress={() => onModeChange('bowling')}>
          <Text style={[styles.toggleOptionText, { color: mode === 'bowling' ? '#FFFFFF' : textSecondary }]}>Bowling</Text>
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

      {players.length > 0 ? (
        <View style={[styles.card, { backgroundColor: cardBg, borderColor, marginTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }]}>
          {players.map((player, index) => (
            <PlayerRow key={player.id} player={player} rank={index + 1} mode={mode} isLast={index === players.length - 1} />
          ))}
        </View>
      ) : (
        <EmptyPlaceholder message={`No ${mode} data available`} textSecondary={textSecondary} />
      )}
    </View>
  );
}

// ─── Teams Grid Tab ───────────────────────────────────────────────────────────

function TeamsGridTab({ activeFormat, isDark, cardBg, borderColor, textPrimary, textSecondary }) {
  const all = buildTeamList();
  const international = all.filter(t => t.category === 'international');
  const ipl           = all.filter(t => t.category === 'ipl');

  const showIPL   = ['ipl', 't20', 'ipl'].includes(activeFormat);
  const showIntl  = !showIPL || activeFormat === 't20';

  const intlShow  = showIntl ? international : [];
  const iplShow   = (activeFormat === 'ipl' || activeFormat === 't20' || activeFormat === 'ipl') ? ipl : [];

  // ALL formats show both; specific formats filter
  const showBoth  = true; // always show both sections, team detail handles format

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: textPrimary }]}>International Teams</Text>
      <View style={styles.teamGrid}>
        {international.map(t => (
          <TeamGridCard key={t.name} team={t} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} />
        ))}
      </View>

      <Text style={[styles.sectionTitle, { color: textPrimary }]}>IPL Franchises</Text>
      <View style={styles.teamGrid}>
        {ipl.map(t => (
          <TeamGridCard key={t.name} team={t} cardBg={cardBg} borderColor={borderColor} textPrimary={textPrimary} />
        ))}
      </View>
    </View>
  );
}

function TeamGridCard({ team, cardBg, borderColor, textPrimary }) {
  return (
    <TouchableOpacity
      style={[styles.teamCard, { backgroundColor: cardBg, borderColor }]}
      onPress={() => router.push(`/cricket/team/${encodeURIComponent(team.name)}`)}
      activeOpacity={0.75}
    >
      <View style={[styles.teamCardBadge, { backgroundColor: team.color }]}>
        <Text style={styles.teamCardBadgeText}>{team.abbr.slice(0, 3)}</Text>
      </View>
      <Text style={[styles.teamCardName, { color: textPrimary }]} numberOfLines={2}>{team.name}</Text>
    </TouchableOpacity>
  );
}

// ─── Rankings Tab ─────────────────────────────────────────────────────────────

function RankingsTab({ isDark, cardBg, borderColor, textPrimary, textSecondary }) {
  const [rankFmt, setRankFmt] = useState('test');
  const RANK_FORMATS = ['test', 'odi', 't20i'];

  const { data, loading, error, reload } = useCricketData(
    () => getCricketRankings(rankFmt),
    [rankFmt],
  );

  const rankings = Array.isArray(data) ? data : data?.rankings?.teams ?? data?.teams ?? [];

  return (
    <View>
      <View style={styles.rankFmtRow}>
        {RANK_FORMATS.map(f => {
          const active = rankFmt === f;
          return (
            <TouchableOpacity
              key={f}
              onPress={() => setRankFmt(f)}
              style={[styles.rankFmtPill, { backgroundColor: active ? '#1D5C33' : cardBg, borderColor: active ? '#1D5C33' : borderColor }]}
            >
              <Text style={[styles.rankFmtText, { color: active ? '#FFFFFF' : textSecondary }]}>{f.toUpperCase()}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading ? (
        <LoadingPlaceholder />
      ) : error ? (
        <ErrorPlaceholder error={error} onRetry={reload} textSecondary={textSecondary} />
      ) : (
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={[styles.rankingsHeader, { borderBottomColor: borderColor }]}>
            <Text style={[styles.rankingsHeaderText, { color: textPrimary }]}>🏆 {rankFmt.toUpperCase()} Rankings</Text>
          </View>
          <RankingsTableHeader borderColor={borderColor} textSecondary={textSecondary} />
          {rankings.map((team, idx) => (
            <RankingRow
              key={team.rank ?? idx}
              team={team}
              isLast={idx === rankings.length - 1}
              textPrimary={textPrimary}
              textSecondary={textSecondary}
              borderColor={borderColor}
            />
          ))}
        </View>
      )}
    </View>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

function RankingsTableHeader({ borderColor, textSecondary }) {
  return (
    <View style={[styles.tableHeader, { borderBottomColor: borderColor }]}>
      <Text style={[styles.tableHeaderCell, { color: textSecondary, width: 28 }]}>#</Text>
      <Text style={[styles.tableHeaderCell, styles.teamCol, { color: textSecondary }]}>Team</Text>
      <Text style={[styles.tableHeaderCell, { color: textSecondary, minWidth: 52 }]}>Rating</Text>
      <Text style={[styles.tableHeaderCell, { color: textSecondary, minWidth: 44 }]}>Points</Text>
    </View>
  );
}

function RankingRow({ team, isLast, textPrimary, textSecondary, borderColor }) {
  const isTop3 = (team.rank ?? 99) <= 3;
  const posColor = isTop3 ? '#27AE60' : textSecondary;
  return (
    <View style={[styles.standingRow, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <Text style={[styles.standingPos, { color: posColor }]}>{team.rank}</Text>
      <View style={styles.standingTeam}>
        <View style={[styles.standingBadge, { backgroundColor: getTeamColor(team.name || team.team) }]}>
          <Text style={styles.standingBadgeText}>{(team.name || team.team)?.slice(0, 2)}</Text>
        </View>
        <Text style={[styles.standingName, { color: textPrimary }]}>{team.name || team.team}</Text>
      </View>
      <Text style={[styles.standingRating, { color: '#F59E0B' }]}>{team.rating}</Text>
      <Text style={[styles.standingCell, { color: textPrimary, minWidth: 44 }]}>{team.points}</Text>
    </View>
  );
}

function PerformerCard({ label, player, statValue, statLabel, subStat, accentColor, cardBg, borderColor, textPrimary, textSecondary }) {
  const initials = (player.name || '?').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  return (
    <View style={[styles.performerCard, { backgroundColor: cardBg, borderColor }]}>
      <Text style={[styles.performerLabel, { color: textSecondary }]}>{label}</Text>
      <View style={[styles.performerAvatar, { backgroundColor: player.teamColor || '#555' }]}>
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

function LoadingCard({ cardBg, borderColor }) {
  return (
    <View style={[styles.loadingCard, { backgroundColor: cardBg, borderColor }]}>
      <ActivityIndicator size="small" color="#1D5C33" />
    </View>
  );
}

function LoadingPlaceholder() {
  return <View style={styles.centeredBox}><ActivityIndicator size="large" color="#1D5C33" /></View>;
}

function ErrorPlaceholder({ error, onRetry, textSecondary }) {
  return (
    <View style={styles.centeredBox}>
      <Text style={[styles.emptyText, { color: textSecondary }]}>{error || 'Failed to load'}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryBtn}>
          <Text style={styles.retryBtnText}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

function EmptyPlaceholder({ message, textSecondary }) {
  return <View style={styles.centeredBox}><Text style={[styles.emptyText, { color: textSecondary }]}>{message}</Text></View>;
}

function EmptyCard({ message, cardBg, borderColor, textSecondary }) {
  return (
    <View style={[styles.emptyBox, { backgroundColor: cardBg, borderColor }]}>
      <Text style={[styles.emptyText, { color: textSecondary }]}>{message}</Text>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 4, paddingBottom: 10,
  },
  headerTitle:    { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  headerSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
  liveContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
  },
  liveDot:  { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4ADE80' },
  liveLabel: { color: '#4ADE80', fontSize: 11, fontWeight: '700', letterSpacing: 1 },

  formatBarWrapper: { paddingBottom: 10 },
  formatBar:        { paddingHorizontal: 14, gap: 8, flexDirection: 'row' },
  formatPill:       { paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20 },
  formatLabel:      { fontSize: 13, fontWeight: '600' },
  formatLabelActive:{ fontWeight: '700' },

  tabBarWrapper: { borderBottomWidth: 1 },
  tabBar:        { paddingHorizontal: 12, paddingVertical: 8, gap: 6, flexDirection: 'row' },
  tabPill:       { paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20 },
  tabPillActive: { backgroundColor: '#1D5C33' },
  tabLabel:      { fontSize: 14, fontWeight: '500' },
  tabLabelActive:{ fontWeight: '600' },

  contentArea:   { flex: 1 },
  scrollContent: { padding: 16, paddingBottom: 32 },
  sectionTitle:  { fontSize: 17, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  card:          { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },

  // Matches tab toggle
  viewToggleRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  viewTogglePill: { paddingHorizontal: 20, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
  viewToggleText: { fontSize: 14, fontWeight: '600' },

  // Team grid
  teamGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  teamCard:         { width: '30%', flexGrow: 1, borderRadius: 12, borderWidth: 1, padding: 12, alignItems: 'center' },
  teamCardBadge:    { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  teamCardBadgeText:{ color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: -0.5 },
  teamCardName:     { fontSize: 12, fontWeight: '600', textAlign: 'center', lineHeight: 16 },

  // Rankings tab
  rankFmtRow:   { flexDirection: 'row', gap: 8, marginBottom: 14 },
  rankFmtPill:  { flex: 1, paddingVertical: 9, borderRadius: 10, borderWidth: 1, alignItems: 'center' },
  rankFmtText:  { fontSize: 13, fontWeight: '700' },
  rankingsHeader: { padding: 14, borderBottomWidth: 1 },
  rankingsHeaderText: { fontSize: 15, fontWeight: '700' },

  // Performers
  performersRow:       { flexDirection: 'row', gap: 10, marginBottom: 16 },
  performerCard:       { flex: 1, borderRadius: 14, borderWidth: 1, padding: 14, alignItems: 'center' },
  performerLabel:      { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  performerAvatar:     { width: 50, height: 50, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  performerAvatarText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  performerName:       { fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 2 },
  performerTeam:       { fontSize: 12, marginBottom: 8 },
  performerStatValue:  { fontSize: 28, fontWeight: '800' },
  performerStatLabel:  { fontSize: 11, marginBottom: 4 },
  performerSubStat:    { fontSize: 11, textAlign: 'center', marginTop: 2 },

  // Rankings table
  tableHeader:     { flexDirection: 'row', paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1 },
  tableHeaderCell: { fontSize: 12, fontWeight: '600', textAlign: 'center', minWidth: 28 },
  teamCol:         { flex: 1, textAlign: 'left' },
  viewAllRow:      { padding: 12, borderTopWidth: 1, alignItems: 'center' },
  viewAllText:     { fontSize: 12, color: '#1D5C33', fontWeight: '500' },

  standingRow:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11 },
  standingPos:       { width: 28, fontSize: 13, fontWeight: '700', textAlign: 'center' },
  standingTeam:      { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 },
  standingBadge:     { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  standingBadgeText: { color: '#FFFFFF', fontSize: 8, fontWeight: '800', letterSpacing: -0.5 },
  standingName:      { fontSize: 14, fontWeight: '600' },
  standingCell:      { width: 28, textAlign: 'center', fontSize: 14, fontWeight: '500' },
  standingRating:    { minWidth: 52, textAlign: 'center', fontSize: 14, fontWeight: '700' },

  // Players tab
  toggleWrapper:      { flexDirection: 'row', borderRadius: 10, borderWidth: 1, padding: 3, marginBottom: 12 },
  toggleOption:       { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  toggleOptionActive: { backgroundColor: '#1D5C33' },
  toggleOptionText:   { fontSize: 14, fontWeight: '600' },
  playerColHeader: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1, borderTopLeftRadius: 14, borderTopRightRadius: 14, borderBottomWidth: 0, gap: 10,
  },
  colHeaderRank:  { width: 20, fontSize: 11, fontWeight: '600', textAlign: 'center' },
  colHeaderName:  { flex: 1, fontSize: 11, fontWeight: '600' },
  colHeaderStats: { flexDirection: 'row', gap: 12 },
  colHeaderStat:  { fontSize: 11, fontWeight: '600', minWidth: 40, textAlign: 'center' },

  matchSourceLabel: { fontSize: 11, fontStyle: 'italic', marginBottom: 10 },

  loadingCard: { borderRadius: 14, borderWidth: 1, padding: 32, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  centeredBox: { padding: 40, alignItems: 'center', gap: 12 },
  emptyBox:    { borderRadius: 14, borderWidth: 1, padding: 24, alignItems: 'center', marginBottom: 16 },
  emptyText:   { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  retryBtn:    { backgroundColor: '#1D5C33', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },
  retryBtnText:{ color: '#FFFFFF', fontWeight: '600', fontSize: 14 },
});
