import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemePreference } from '@/context/theme-context';

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', emoji: '☀️' },
  { value: 'dark', label: 'Dark', emoji: '🌙' },
  { value: 'system', label: 'System', emoji: '📱' },
];

const SETTINGS_SECTIONS = [
  {
    title: 'PREFERENCES',
    items: [
      { icon: '🏏', label: 'Default Sport', value: 'Cricket' },
      { icon: '🔔', label: 'Notifications', type: 'toggle' },
    ],
  },
  {
    title: 'ABOUT',
    items: [
      { icon: 'ℹ️', label: 'Version', value: '1.0.0' },
      { icon: '⚡', label: 'Built with', value: 'Expo SDK 54' },
    ],
  },
];

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const { theme, setTheme } = useThemePreference();

  const bg = isDark ? '#0D1117' : '#F0F2F5';
  const cardBg = isDark ? '#1A1F26' : '#FFFFFF';
  const borderColor = isDark ? '#252D38' : '#E4E8ED';
  const textPrimary = isDark ? '#E8EAED' : '#11181C';
  const textSecondary = isDark ? '#8B949E' : '#687076';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>

        {/* Page title */}
        <Text style={[styles.pageTitle, { color: textPrimary }]}>Profile</Text>

        {/* Avatar card */}
        <View style={[styles.avatarCard, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>SA</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={[styles.displayName, { color: textPrimary }]}>Sports Analyst</Text>
            <Text style={[styles.displaySub, { color: textSecondary }]}>IPL 2025 Tracker</Text>
          </View>
        </View>

        {/* Appearance */}
        <Text style={[styles.sectionLabel, { color: textSecondary }]}>APPEARANCE</Text>
        <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
          <View style={styles.themeRow}>
            {THEME_OPTIONS.map(option => {
              const active = theme === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.themeOption,
                    active ? styles.themeOptionActive : { borderColor },
                  ]}
                  onPress={() => setTheme(option.value)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.themeEmoji}>{option.emoji}</Text>
                  <Text style={[
                    styles.themeLabel,
                    { color: active ? '#FFFFFF' : textSecondary },
                    active && styles.themeLabelActive,
                  ]}>
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={[styles.themeHint, { color: textSecondary, borderTopColor: borderColor }]}>
            {theme === 'system'
              ? 'Following device theme'
              : `${theme === 'dark' ? 'Dark' : 'Light'} mode is active`}
          </Text>
        </View>

        {/* Other settings sections */}
        {SETTINGS_SECTIONS.map(section => (
          <View key={section.title}>
            <Text style={[styles.sectionLabel, { color: textSecondary }]}>{section.title}</Text>
            <View style={[styles.card, { backgroundColor: cardBg, borderColor }]}>
              {section.items.map((item, idx) => (
                <SettingsRow
                  key={item.label}
                  item={item}
                  isLast={idx === section.items.length - 1}
                  textPrimary={textPrimary}
                  textSecondary={textSecondary}
                  borderColor={borderColor}
                  isDark={isDark}
                />
              ))}
            </View>
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsRow({ item, isLast, textPrimary, textSecondary, borderColor, isDark }) {
  return (
    <View style={[styles.settingsRow, !isLast && { borderBottomWidth: 1, borderBottomColor: borderColor }]}>
      <View style={[styles.settingsIcon, { backgroundColor: isDark ? '#252D38' : '#F0F2F5' }]}>
        <Text style={styles.settingsEmoji}>{item.icon}</Text>
      </View>
      <Text style={[styles.settingsLabel, { color: textPrimary }]}>{item.label}</Text>
      {item.type === 'toggle' ? (
        <Switch
          value={false}
          trackColor={{ false: '#767577', true: '#1D5C33' }}
          thumbColor="#FFFFFF"
        />
      ) : (
        <Text style={[styles.settingsValue, { color: textSecondary }]}>{item.value}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 20, paddingBottom: 32 },
  pageTitle: { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, marginBottom: 20, marginTop: 4 },

  // Avatar card
  avatarCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1D5C33',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#FFFFFF', fontSize: 22, fontWeight: '800' },
  avatarInfo: { flex: 1 },
  displayName: { fontSize: 18, fontWeight: '700', marginBottom: 3 },
  displaySub: { fontSize: 13 },

  // Section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },

  // Card wrapper
  card: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 24,
  },

  // Theme selector
  themeRow: {
    flexDirection: 'row',
    gap: 10,
    padding: 12,
  },
  themeOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1.5,
    gap: 6,
  },
  themeOptionActive: {
    backgroundColor: '#1D5C33',
    borderColor: '#1D5C33',
  },
  themeEmoji: { fontSize: 22 },
  themeLabel: { fontSize: 12, fontWeight: '600' },
  themeLabelActive: { color: '#FFFFFF' },
  themeHint: {
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderTopWidth: 1,
  },

  // Settings rows
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 12,
  },
  settingsIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsEmoji: { fontSize: 16 },
  settingsLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  settingsValue: { fontSize: 14 },
});
