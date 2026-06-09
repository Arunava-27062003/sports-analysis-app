import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColorScheme } from '@/hooks/use-color-scheme';

// Pressure label and colour based on Required Run Rate
function getPressure(rrr) {
  if (rrr > 12)  return { label: 'Very Difficult', color: '#EF4444' };
  if (rrr > 10)  return { label: 'Under Pressure', color: '#F59E0B' };
  if (rrr > 8)   return { label: 'Challenging',    color: '#FBBF24' };
  return           { label: 'Manageable',           color: '#27AE60' };
}

// Colour for a single ball chip
function ballColor(ball) {
  if (ball === 'W')  return '#EF4444';
  if (ball === '6')  return '#8B5CF6';
  if (ball === '4')  return '#3B82F6';
  if (ball === '0')  return '#374151';
  return '#1D5C33';
}

export function LiveAnalysis({ match, players }) {
  const { liveData, innings1, innings2 } = match;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const innerBg       = isDark ? '#13171D' : '#F7F9FC';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  const { label: pressureLabel, color: pressureColor } = getPressure(liveData.requiredRunRate);
  const crr = liveData.currentRunRate;
  const rrr = liveData.requiredRunRate;

  // Find career stats for each current batsman from the format's players array
  const enrichedBatsmen = liveData.currentBatsmen.map(b => ({
    ...b,
    career: players.find(p => p.id === b.id) ?? null,
  }));

  return (
    <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>

      {/* ── Header ── */}
      <View style={styles.liveHeader}>
        <View style={styles.livePill}>
          <View style={styles.liveDot} />
          <Text style={styles.livePillText}>LIVE</Text>
        </View>
        <View style={styles.liveHeaderText}>
          <Text style={[styles.chaseTitle, { color: textPrimary }]}>
            {innings2.teamShort} chasing {liveData.target}
          </Text>
          <Text style={[styles.chaseSubtitle, { color: textSecondary }]} numberOfLines={1}>
            {match.tournament}
          </Text>
        </View>
      </View>

      {/* ── Situation bar ── */}
      <View style={[styles.metricsRow, { borderTopColor: borderColor, borderBottomColor: borderColor, backgroundColor: innerBg }]}>
        <MetricCell label="Target"  value={liveData.target}          color={textPrimary}   textSecondary={textSecondary} />
        <Divider color={borderColor} />
        <MetricCell label="Needed"  value={liveData.runsNeeded}      color="#EF4444"       textSecondary={textSecondary} />
        <Divider color={borderColor} />
        <MetricCell label="Balls"   value={liveData.ballsRemaining}  color={textPrimary}   textSecondary={textSecondary} />
        <Divider color={borderColor} />
        <MetricCell label="CRR"     value={crr.toFixed(2)}           color="#27AE60"       textSecondary={textSecondary} />
        <Divider color={borderColor} />
        <MetricCell label="RRR"     value={rrr.toFixed(2)}           color="#EF4444"       textSecondary={textSecondary} />
      </View>

      {/* ── Run-rate bar ── */}
      <View style={styles.rateBarSection}>
        <RateBar label="CRR" value={crr} max={Math.max(crr, rrr) * 1.2} color="#27AE60" textSecondary={textSecondary} textPrimary={textPrimary} />
        <RateBar label="RRR" value={rrr} max={Math.max(crr, rrr) * 1.2} color="#EF4444" textSecondary={textSecondary} textPrimary={textPrimary} />
        <View style={styles.pressureRow}>
          <Text style={[styles.pressureHeading, { color: textSecondary }]}>Chase Status</Text>
          <View style={[styles.pressureBadge, { backgroundColor: pressureColor + '22', borderColor: pressureColor + '55' }]}>
            <Text style={[styles.pressureBadgeText, { color: pressureColor }]}>{pressureLabel}</Text>
          </View>
        </View>
      </View>

      {/* ── At the crease ── */}
      <View style={[styles.sectionDivider, { borderColor }]}>
        <Text style={[styles.sectionLabel, { color: textSecondary }]}>AT THE CREASE</Text>
      </View>

      {enrichedBatsmen.map((b, idx) => (
        <BatsmanRow
          key={b.id ?? idx}
          batsman={b}
          isLast={idx === enrichedBatsmen.length - 1}
          borderColor={borderColor}
          textPrimary={textPrimary}
          textSecondary={textSecondary}
        />
      ))}

      {/* ── Partnership ── */}
      <View style={[styles.partnershipRow, { borderTopColor: borderColor, backgroundColor: innerBg }]}>
        <Text style={[styles.partnershipLabel, { color: textSecondary }]}>Partnership</Text>
        <Text style={[styles.partnershipValue, { color: textPrimary }]}>
          {liveData.partnershipRuns} runs · {liveData.partnershipBalls} balls
          {' · '}SR {(liveData.partnershipRuns / liveData.partnershipBalls * 100).toFixed(1)}
        </Text>
      </View>

      {/* ── Current over ── */}
      <View style={[styles.overSection, { borderTopColor: borderColor }]}>
        <Text style={[styles.bowlerLine, { color: textSecondary }]}>
          {liveData.currentBowler.name}
          {'  '}
          <Text style={{ color: textPrimary }}>{liveData.currentBowler.overs} ov</Text>
          {'  ·  '}
          <Text style={{ color: textPrimary }}>{liveData.currentBowler.runsConceded} runs</Text>
          {'  ·  '}
          <Text style={{ color: liveData.currentBowler.wickets > 0 ? '#EF4444' : textPrimary }}>
            {liveData.currentBowler.wickets} wkt{liveData.currentBowler.wickets !== 1 ? 's' : ''}
          </Text>
        </Text>
        <View style={styles.ballsRow}>
          {liveData.recentBalls.map((ball, i) => (
            <View key={i} style={[styles.ballChip, { backgroundColor: ballColor(ball) }]}>
              <Text style={styles.ballChipText}>{ball}</Text>
            </View>
          ))}
          <View style={[styles.ballChipCurrent, { borderColor: '#4ADE80' }]}>
            <Text style={[styles.ballChipCurrentText, { color: '#4ADE80' }]}>•</Text>
          </View>
        </View>
      </View>

    </View>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function MetricCell({ label, value, color, textSecondary }) {
  return (
    <View style={styles.metricCell}>
      <Text style={[styles.metricValue, { color }]}>{value}</Text>
      <Text style={[styles.metricLabel, { color: textSecondary }]}>{label}</Text>
    </View>
  );
}

function Divider({ color }) {
  return <View style={[styles.metricDivider, { backgroundColor: color }]} />;
}

function RateBar({ label, value, max, color, textSecondary, textPrimary }) {
  const pct = Math.min(value / max, 1);
  return (
    <View style={styles.rateBarRow}>
      <Text style={[styles.rateBarLabel, { color: textSecondary }]}>{label}</Text>
      <View style={styles.rateBarTrack}>
        <View style={[styles.rateBarFill, { width: `${pct * 100}%`, backgroundColor: color }]} />
      </View>
      <Text style={[styles.rateBarValue, { color }]}>{value.toFixed(2)}</Text>
    </View>
  );
}

function BatsmanRow({ batsman, isLast, borderColor, textPrimary, textSecondary }) {
  const { career } = batsman;
  const currentSR = batsman.balls > 0 ? (batsman.runs / batsman.balls * 100).toFixed(1) : '-';
  const srNum = parseFloat(currentSR);
  const srColor = srNum > 150 ? '#27AE60' : srNum > 100 ? '#F59E0B' : '#EF4444';
  const initials = batsman.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColor = career?.teamColor ?? '#555555';

  return (
    <View style={[styles.batsmanRow, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <View style={[styles.batsmanAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.batsmanAvatarText}>{initials}</Text>
      </View>
      <View style={styles.batsmanInfo}>
        <Text style={[styles.batsmanName, { color: textPrimary }]}>{batsman.name}</Text>
        {career ? (
          <Text style={[styles.careerStat, { color: textSecondary }]}>
            Career · SR {career.batting.strikeRate.toFixed(1)} · Avg {career.batting.average.toFixed(1)}
            {career.batting.hundreds > 0 ? ` · ${career.batting.hundreds}×100` : ''}
          </Text>
        ) : (
          <Text style={[styles.careerStat, { color: textSecondary }]}>Career stats not available</Text>
        )}
      </View>
      <View style={styles.currentInnings}>
        <Text style={[styles.currentRuns, { color: textPrimary }]}>{batsman.runs}*</Text>
        <Text style={[styles.currentBalls, { color: textSecondary }]}>({batsman.balls}b)</Text>
        <Text style={[styles.currentSR, { color: srColor }]}>{currentSR}</Text>
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },

  // Header
  liveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 10,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(239,68,68,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#EF4444' },
  livePillText: { color: '#EF4444', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  liveHeaderText: { flex: 1 },
  chaseTitle: { fontSize: 15, fontWeight: '700' },
  chaseSubtitle: { fontSize: 12, marginTop: 1 },

  // Metrics bar
  metricsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingVertical: 12,
  },
  metricCell: { flex: 1, alignItems: 'center' },
  metricValue: { fontSize: 16, fontWeight: '800' },
  metricLabel: { fontSize: 10, fontWeight: '600', marginTop: 2, textTransform: 'uppercase' },
  metricDivider: { width: 1 },

  // Run-rate bars
  rateBarSection: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 4, gap: 8 },
  rateBarRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  rateBarLabel: { width: 32, fontSize: 11, fontWeight: '600' },
  rateBarTrack: { flex: 1, height: 6, borderRadius: 3, backgroundColor: 'rgba(128,128,128,0.2)', overflow: 'hidden' },
  rateBarFill: { height: 6, borderRadius: 3 },
  rateBarValue: { width: 40, textAlign: 'right', fontSize: 12, fontWeight: '700' },
  pressureRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6, marginBottom: 6 },
  pressureHeading: { fontSize: 12, fontWeight: '600' },
  pressureBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  pressureBadgeText: { fontSize: 12, fontWeight: '700' },

  // Section divider
  sectionDivider: { paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderBottomWidth: 1 },
  sectionLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1 },

  // Batsmen
  batsmanRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, gap: 10 },
  batsmanAvatar: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  batsmanAvatarText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  batsmanInfo: { flex: 1 },
  batsmanName: { fontSize: 14, fontWeight: '600' },
  careerStat: { fontSize: 11, marginTop: 2 },
  currentInnings: { alignItems: 'flex-end' },
  currentRuns: { fontSize: 18, fontWeight: '800' },
  currentBalls: { fontSize: 11, marginTop: 1 },
  currentSR: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  // Partnership
  partnershipRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
  },
  partnershipLabel: { fontSize: 11, fontWeight: '600' },
  partnershipValue: { fontSize: 13, fontWeight: '600' },

  // Over / balls
  overSection: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 12, borderTopWidth: 1, gap: 8 },
  bowlerLine: { fontSize: 12 },
  ballsRow: { flexDirection: 'row', gap: 6 },
  ballChip: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  ballChipText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  ballChipCurrent: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  ballChipCurrentText: { fontSize: 16, fontWeight: '700' },
});
