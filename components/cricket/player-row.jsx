import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';

function getInitials(name) {
  return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

export function PlayerRow({ player, rank, mode, isLast = false }) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const borderColor = isDark ? '#2C3338' : '#E8ECEF';
  const textPrimary = isDark ? '#ECEDEE' : '#11181C';
  const textSecondary = isDark ? '#9BA1A6' : '#687076';
  const rankColor = rank <= 3 ? '#F9A825' : textSecondary;

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={() => router.push(`/cricket/player/${player.id}`)}
      style={[styles.row, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}
    >
      <Text style={[styles.rank, { color: rankColor }]}>{rank}</Text>

      <View style={[styles.avatar, { backgroundColor: player.teamColor }]}>
        <Text style={styles.avatarText}>{getInitials(player.name)}</Text>
      </View>

      <View style={styles.info}>
        <Text style={[styles.name, { color: textPrimary }]} numberOfLines={1}>{player.name}</Text>
        <Text style={[styles.meta, { color: textSecondary }]}>{player.teamShort} · {player.role}</Text>
      </View>

      <View style={styles.statsRow}>
        {mode === 'batting' ? (
          <>
            <StatCell value={String(player.batting.runs)} label="Runs" textPrimary={textPrimary} textSecondary={textSecondary} />
            <StatCell value={player.batting.average.toFixed(1)} label="Avg" textPrimary={textPrimary} textSecondary={textSecondary} />
            <StatCell value={player.batting.strikeRate.toFixed(1)} label="SR" textPrimary={textPrimary} textSecondary={textSecondary} />
          </>
        ) : (
          <>
            <StatCell value={String(player.bowling.wickets)} label="Wkts" textPrimary={textPrimary} textSecondary={textSecondary} />
            <StatCell value={player.bowling.economy.toFixed(1)} label="Econ" textPrimary={textPrimary} textSecondary={textSecondary} />
            <StatCell value={player.bowling.average.toFixed(1)} label="Avg" textPrimary={textPrimary} textSecondary={textSecondary} />
          </>
        )}
      </View>

      <Text style={[styles.chevron, { color: textSecondary }]}>›</Text>
    </TouchableOpacity>
  );
}

function StatCell({ value, label, textPrimary, textSecondary }) {
  return (
    <View style={styles.statCell}>
      <Text style={[styles.statValue, { color: textPrimary }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 14, gap: 10 },
  rank: { width: 20, fontSize: 13, fontWeight: '600', textAlign: 'center' },
  avatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
  info: { flex: 1, minWidth: 0 },
  name: { fontSize: 14, fontWeight: '600' },
  meta: { fontSize: 12, marginTop: 1 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statCell: { alignItems: 'center', minWidth: 40 },
  statValue: { fontSize: 14, fontWeight: '600' },
  statLabel: { fontSize: 10, marginTop: 1 },
  chevron: { fontSize: 18, lineHeight: 22, marginLeft: 6 },
});
