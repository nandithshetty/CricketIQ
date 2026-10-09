import React, { useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors, typography } from '../theme';
import { resolveImageUrl } from '../api/client';

export default function PlayerAvatar({ url, name = '', size = 56, style }) {
  const [imageError, setImageError] = useState(false);

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const resolved = resolveImageUrl(url);
  const showFallback = !resolved || imageError;

  const dynamicStyles = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  if (showFallback) {
    return (
      <View style={[styles.fallbackContainer, dynamicStyles, style]}>
        <Text style={[styles.initials, { fontSize: Math.max(12, Math.floor(size * 0.38)) }]}>
          {getInitials(name)}
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri: resolved }}
      style={[styles.image, dynamicStyles, style]}
      resizeMode="cover"
      onError={() => setImageError(true)}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.borderLight,
  },
  fallbackContainer: {
    backgroundColor: colors.surfaceLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
