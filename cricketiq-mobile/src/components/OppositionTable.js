import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from '../theme';

export default function OppositionTable({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No opposition records available for this format.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={[styles.headerCell, styles.teamCell]}>OPPOSITION</Text>
        <Text style={[styles.headerCell, styles.numCell]}>MAT</Text>
        <Text style={[styles.headerCell, styles.numCell]}>RUNS</Text>
        <Text style={[styles.headerCell, styles.numCell]}>AVG</Text>
        <Text style={[styles.headerCell, styles.numCell]}>100s</Text>
        <Text style={[styles.headerCell, styles.numCell]}>WKTS</Text>
      </View>

      {data.map((item, index) => {
        const teamName = item.opposition_name || item.opposition_team || item.team_name || 'Opponent';
        const matches = item.matches ?? '-';
        const runs = item.runs ?? 0;
        const avg = item.batting_average != null ? Number(item.batting_average).toFixed(1) : (item.average != null ? Number(item.average).toFixed(1) : '-');
        const hundreds = item.hundreds ?? item.centuries ?? 0;
        const wickets = item.wickets ?? 0;

        return (
          <View
            key={`${teamName}-${index}`}
            style={[styles.row, index % 2 === 1 && styles.rowAlt]}
          >
            <Text style={[styles.cell, styles.teamCell, styles.teamText]} numberOfLines={1}>
              {teamName}
            </Text>
            <Text style={[styles.cell, styles.numCell]}>{matches}</Text>
            <Text style={[styles.cell, styles.numCell, styles.runsText]}>{runs}</Text>
            <Text style={[styles.cell, styles.numCell]}>{avg}</Text>
            <Text style={[styles.cell, styles.numCell]}>{hundreds}</Text>
            <Text style={[styles.cell, styles.numCell]}>{wickets}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCell: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textSecondary,
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
    alignItems: 'center',
  },
  rowAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  cell: {
    fontSize: typography.fontSize.xs,
    color: colors.text,
  },
  teamCell: {
    flex: 2.2,
  },
  teamText: {
    fontWeight: typography.fontWeight.semiBold,
    color: colors.text,
  },
  numCell: {
    flex: 1,
    textAlign: 'center',
  },
  runsText: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  emptyContainer: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
