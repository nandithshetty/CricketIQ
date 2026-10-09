import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import PlayerAvatar from './PlayerAvatar';

export default function PlayerCard({ player, onPress, onComparePress, isComparing, isSelectedForCompare }) {
  if (!player) return null;

  return (
    <TouchableOpacity
      style={[styles.card, isSelectedForCompare && styles.cardSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <PlayerAvatar url={player.photo_url} name={player.name} size={56} style={styles.avatar} />

      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>
            {player.name}
          </Text>
          <View style={styles.countryBadge}>
            <Text style={styles.countryText}>{player.country}</Text>
          </View>
        </View>

        <View style={styles.badgeRow}>
          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{player.role || 'Player'}</Text>
          </View>
          {player.batting_style ? (
            <Text style={styles.styleText} numberOfLines={1}>
              {player.batting_style}
            </Text>
          ) : null}
        </View>
      </View>

      {isComparing ? (
        <TouchableOpacity
          style={[styles.checkbox, isSelectedForCompare && styles.checkboxActive]}
          onPress={onComparePress}
        >
          {isSelectedForCompare ? (
            <Ionicons name="checkmark" size={16} color="#0F172A" />
          ) : null}
        </TouchableOpacity>
      ) : (
        <Ionicons name="chevron-forward" size={20} color={colors.textMuted} style={styles.arrow} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSelected: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(6, 182, 212, 0.08)',
  },
  avatar: {
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  name: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
    marginRight: spacing.sm,
  },
  countryBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  countryText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeight.medium,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: 2,
  },
  roleBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: spacing.borderRadius.sm,
  },
  roleText: {
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  styleText: {
    fontSize: 11,
    color: colors.textMuted,
    flex: 1,
  },
  arrow: {
    marginLeft: spacing.sm,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: spacing.sm,
  },
  checkboxActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
});
