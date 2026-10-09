import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';

export default function AIInsightCard({ summary, groundedStats, loading, onRefresh }) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Ionicons name="sparkles" size={18} color={colors.primary} style={styles.icon} />
          <Text style={styles.title}>AI Performance Summary</Text>
        </View>
        {onRefresh ? (
          <TouchableOpacity
            onPress={onRefresh}
            disabled={loading}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {loading ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <Ionicons name="refresh" size={18} color={colors.textSecondary} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>

      {loading && !summary ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={colors.primary} />
          <Text style={styles.loadingText}>Generating grounded AI analytics...</Text>
        </View>
      ) : summary ? (
        <View>
          <Text style={styles.summaryText}>{summary}</Text>

          {groundedStats && Object.keys(groundedStats).length > 0 ? (
            <View style={styles.groundedContainer}>
              <Text style={styles.groundedTitle}>VERIFIED STAT HIGHLIGHTS</Text>
              <View style={styles.pillWrap}>
                {Object.entries(groundedStats).map(([key, val]) => (
                  <View key={key} style={styles.statPill}>
                    <Text style={styles.statPillLabel}>{key.replace(/_/g, ' ')}: </Text>
                    <Text style={styles.statPillValue}>{String(val)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>
      ) : (
        <Text style={styles.emptyText}>
          No summary available yet. Tap refresh to generate grounded AI insights.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(6, 182, 212, 0.05)',
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.25)',
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 6,
  },
  title: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
    letterSpacing: 0.3,
  },
  summaryText: {
    fontSize: typography.fontSize.sm,
    color: colors.text,
    lineHeight: 22,
    fontWeight: typography.fontWeight.regular,
  },
  loadingContainer: {
    paddingVertical: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  groundedContainer: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  groundedTitle: {
    fontSize: 10,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  pillWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  statPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statPillLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    textTransform: 'capitalize',
  },
  statPillValue: {
    fontSize: 11,
    color: colors.secondary,
    fontWeight: typography.fontWeight.bold,
  },
  emptyText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
});
