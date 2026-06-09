import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useLiveMatches } from '@/hooks/use-live-matches';

const COMING_SOON_SPORTS = [
  { id: 'football', name: 'Football', description: 'Premier League · La Liga', emoji: '⚽', color: '#1A3A5C' },
  { id: 'basketball', name: 'Basketball', description: 'NBA · EuroLeague', emoji: '🏀', color: '#5C1A1A' },
  { id: 'tennis', name: 'Tennis', description: 'ATP · WTA Rankings', emoji: '🎾', color: '#3B1A5C' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { matches: apiLiveMatches } = useLiveMatches();
  const cricketLive = apiLiveMatches.length > 0;
  const featuredDesc = cricketLive
    ? `${apiLiveMatches.length} match${apiLiveMatches.length > 1 ? 'es' : ''} live now`
    : 'IPL 2026 · RCB Back-to-Back Champions';

  const bg = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: textSecondary }]}>Welcome back</Text>
          <Text style={[styles.title, { color: textPrimary }]}>Sports Analysis</Text>
        </View>

        <Text style={[styles.sectionLabel, { color: textSecondary }]}>FEATURED</Text>
        <TouchableOpacity
          style={styles.featuredCard}
          onPress={() => router.push('/(tabs)/cricket')}
          activeOpacity={0.85}
        >
          <View style={styles.featuredContent}>
            {cricketLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveBadgeDot} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
            <Text style={[styles.featuredName, cricketLive && { marginTop: 0 }]}>Cricket</Text>
            <Text style={styles.featuredDesc}>{featuredDesc}</Text>
            <View style={styles.featuredCta}>
              <Text style={styles.featuredCtaText}>View Analysis →</Text>
            </View>
          </View>
          <Text style={styles.featuredEmoji}>🏏</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionLabel, { color: textSecondary, marginTop: 8 }]}>MORE SPORTS</Text>
        <View style={styles.grid}>
          {COMING_SOON_SPORTS.map(sport => (
            <View key={sport.id} style={[styles.sportCard, { backgroundColor: cardBg, borderColor }]}>
              <View style={[styles.sportCardIcon, { backgroundColor: sport.color }]}>
                <Text style={styles.sportCardEmoji}>{sport.emoji}</Text>
              </View>
              <View style={styles.sportCardBody}>
                <Text style={[styles.sportCardName, { color: textPrimary }]}>{sport.name}</Text>
                <Text style={[styles.sportCardDesc, { color: textSecondary }]}>{sport.description}</Text>
              </View>
              <View style={styles.soonBadge}>
                <Text style={styles.soonText}>Soon</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 32,
  },
  header: {
    marginBottom: 24,
    marginTop: 4,
  },
  greeting: {
    fontSize: 14,
    marginBottom: 4,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 10,
  },
  featuredCard: {
    backgroundColor: '#0F2D1A',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  featuredContent: {
    flex: 1,
  },
  liveBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(74,222,128,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 10,
  },
  liveBadgeDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#4ADE80' },
  liveBadgeText: {
    color: '#4ADE80',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  featuredName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  featuredDesc: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 16,
  },
  featuredCta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  featuredCtaText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  featuredEmoji: {
    fontSize: 56,
    marginLeft: 8,
  },
  grid: {
    gap: 10,
  },
  sportCard: {
    borderRadius: 14,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  sportCardIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sportCardEmoji: {
    fontSize: 24,
  },
  sportCardBody: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  sportCardName: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 2,
  },
  sportCardDesc: {
    fontSize: 12,
  },
  soonBadge: {
    marginRight: 14,
    backgroundColor: 'rgba(107,114,128,0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  soonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#6B7280',
  },
});
