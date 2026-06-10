import React, { useState, useCallback, useRef } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { MatchCard } from '@/components/cricket/match-card';
import { PlayerRow } from '@/components/cricket/player-row';
import { searchCricket } from '@/services/cricket-api';

const FILTER_TYPES = [
  { id: 'all',     label: 'All'     },
  { id: 'matches', label: 'Matches' },
  { id: 'players', label: 'Players' },
];

export default function SearchScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const bg            = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg        = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor   = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary   = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';
  const inputBg       = isDark ? '#1A1F26' : '#FFFFFF';

  const [query,      setQuery]      = useState('');
  const [filter,     setFilter]     = useState('all');
  const [results,    setResults]    = useState(null);   // null = pristine
  const [loading,    setLoading]    = useState(false);
  const debounceRef  = useRef(null);

  const doSearch = useCallback(async (q, type) => {
    if (!q || q.trim().length < 2) { setResults(null); return; }
    setLoading(true);
    try {
      const data = await searchCricket(q.trim(), type);
      setResults(data);
    } catch {
      setResults({ matches: [], players: [] });
    } finally {
      setLoading(false);
    }
  }, []);

  function handleQueryChange(text) {
    setQuery(text);
    clearTimeout(debounceRef.current);
    if (text.trim().length < 2) { setResults(null); return; }
    debounceRef.current = setTimeout(() => doSearch(text, filter), 400);
  }

  function handleFilterChange(type) {
    setFilter(type);
    if (query.trim().length >= 2) doSearch(query, type);
  }

  function handleClear() {
    setQuery('');
    setResults(null);
    Keyboard.dismiss();
  }

  const matches = results?.matches ?? [];
  const players = results?.players ?? [];
  const total   = matches.length + players.length;

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0F2D1A' }]} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <Text style={styles.headerSub}>Matches · Players · Teams</Text>
      </View>

      {/* Search bar */}
      <View style={[styles.searchBar, { backgroundColor: inputBg, borderColor }]}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={[styles.input, { color: textPrimary }]}
          placeholder="Team, player, venue, series…"
          placeholderTextColor={textSecondary}
          value={query}
          onChangeText={handleQueryChange}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={() => { clearTimeout(debounceRef.current); doSearch(query, filter); }}
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={handleClear} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={[styles.clearBtn, { color: textSecondary }]}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Content */}
      <View style={[styles.content, { backgroundColor: bg }]}>
        {/* Filter chips */}
        <View style={styles.filterRow}>
          {FILTER_TYPES.map(f => {
            const active = filter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => handleFilterChange(f.id)}
                style={[styles.filterChip, { borderColor }, active && styles.filterChipActive]}
              >
                <Text style={[styles.filterLabel, { color: active ? '#FFFFFF' : textSecondary }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Loading */}
          {loading && (
            <View style={styles.centeredBox}>
              <ActivityIndicator size="large" color="#1D5C33" />
            </View>
          )}

          {/* Pristine — no query yet */}
          {!loading && results === null && (
            <View style={styles.centeredBox}>
              <Text style={styles.emptyIcon}>🏏</Text>
              <Text style={[styles.emptyTitle, { color: textPrimary }]}>Search cricket</Text>
              <Text style={[styles.emptyBody, { color: textSecondary }]}>
                Find matches by teams, venue or series.{'\n'}Find players by name.
              </Text>
            </View>
          )}

          {/* No results */}
          {!loading && results !== null && total === 0 && (
            <View style={styles.centeredBox}>
              <Text style={styles.emptyIcon}>🔎</Text>
              <Text style={[styles.emptyTitle, { color: textPrimary }]}>No results</Text>
              <Text style={[styles.emptyBody, { color: textSecondary }]}>
                Try a different team name, player or venue.
              </Text>
            </View>
          )}

          {/* Match results */}
          {!loading && matches.length > 0 && (filter === 'all' || filter === 'matches') && (
            <>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>
                Matches{matches.length > 0 ? ` · ${matches.length}` : ''}
              </Text>
              {matches.map(m => <MatchCard key={m.id} match={m} />)}
            </>
          )}

          {/* Player results */}
          {!loading && players.length > 0 && (filter === 'all' || filter === 'players') && (
            <>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>
                Players{players.length > 0 ? ` · ${players.length}` : ''}
              </Text>
              <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
                {players.map((p, i) => (
                  <PlayerRow
                    key={p.id}
                    player={p}
                    rank={i + 1}
                    mode="batting"
                    isLast={i === players.length - 1}
                  />
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },

  header: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12 },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', letterSpacing: -0.5 },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    marginHorizontal: 14, marginBottom: 10,
    borderRadius: 14, borderWidth: 1,
    paddingHorizontal: 14, paddingVertical: 10,
  },
  searchIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, paddingVertical: 0 },
  clearBtn: { fontSize: 16, fontWeight: '600', paddingHorizontal: 2 },

  content: { flex: 1 },

  filterRow: {
    flexDirection: 'row', gap: 8,
    paddingHorizontal: 14, paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16, paddingVertical: 7,
    borderRadius: 20, borderWidth: 1,
  },
  filterChipActive: { backgroundColor: '#1D5C33', borderColor: '#1D5C33' },
  filterLabel: { fontSize: 13, fontWeight: '600' },

  scrollContent: { paddingHorizontal: 14, paddingBottom: 32 },

  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 10, marginTop: 4 },
  card: { borderRadius: 14, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },

  centeredBox: { paddingVertical: 60, alignItems: 'center', gap: 10 },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 18, fontWeight: '700' },
  emptyBody: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
});
