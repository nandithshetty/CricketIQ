import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function FilterChips({ options, selected, onSelect, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[styles.container, style]}
    >
      {options.map((item) => {
        const isSelected = selected === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            onPress={() => onSelect(item.value)}
            style={[styles.chip, isSelected && styles.chipActive]}
            activeOpacity={0.7}
          >
            <Text style={[styles.chipText, isSelected && styles.chipTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 7,
    borderRadius: spacing.borderRadius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: 'rgba(6, 182, 212, 0.15)',
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  chipTextActive: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
});
