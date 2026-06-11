import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { getTeamFlagUrl, getTeamAbbr, getTeamColor } from '@/constants/teams';

/**
 * Shows a country flag for international teams, colored badge for IPL/others.
 * size: pixel size of the square avatar.
 */
export function TeamAvatar({ name, size = 40, style }) {
  const [error, setError] = useState(false);
  const flagUrl = getTeamFlagUrl(name);
  const color   = getTeamColor(name);
  const abbr    = getTeamAbbr(name);

  if (flagUrl && !error) {
    return (
      <View style={[styles.flagWrap, { width: size, height: size, borderRadius: size * 0.15 }, style]}>
        <Image
          source={{ uri: flagUrl }}
          style={styles.flagImg}
          resizeMode="cover"
          onError={() => setError(true)}
        />
      </View>
    );
  }

  return (
    <View style={[styles.badge, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }, style]}>
      <Text style={[styles.badgeText, { fontSize: Math.round(size * 0.28) }]}>
        {abbr.slice(0, 3)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flagWrap: { overflow: 'hidden' },
  flagImg:  { width: '100%', height: '100%' },
  badge:    { alignItems: 'center', justifyContent: 'center' },
  badgeText:{ color: '#FFFFFF', fontWeight: '800', letterSpacing: -0.5 },
});
