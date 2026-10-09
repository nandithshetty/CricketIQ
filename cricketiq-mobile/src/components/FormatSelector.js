import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

const DEFAULT_FORMATS = [
  { key: 'TEST', label: 'Test' },
  { key: 'ODI', label: 'ODI' },
  { key: 'T20I', label: 'T20I' },
];

export default function FormatSelector({ formats = DEFAULT_FORMATS, selected, onSelect, style }) {
  return (
    <View style={[styles.container, style]}>
      {formats.map((fmt) => {
        const isSelected = selected === fmt.key;
        return (
          <TouchableOpacity
            key={fmt.key}
            style={[styles.tab, isSelected && styles.tabActive]}
            onPress={() => onSelect(fmt.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, isSelected && styles.tabTextActive]}>
              {fmt.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    borderRadius: spacing.borderRadius.md,
    padding: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: spacing.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  tabText: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: '#0F172A',
    fontWeight: typography.fontWeight.bold,
  },
});
