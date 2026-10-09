import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { getLeaderboard } from '../api/leaderboards';
import PlayerAvatar from '../components/PlayerAvatar';
import FormatSelector from '../components/FormatSelector';
import FilterChips from '../components/FilterChips';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';
import EmptyState from '../components/EmptyState';

const STAT_OPTIONS = [
  { label: '🏏 Runs', value: 'runs' },
  { label: '📊 Batting Avg', value: 'average' },
  { label: '⚡ Strike Rate', value: 'strike_rate' },
  { label: '💯 Centuries', value: 'hundreds' },
  { label: '🎯 Wickets', value: 'wickets' },
  { label: '🛡️ Economy', value: 'economy' },
  { label: '🎯 Bowling Avg', value: 'bowling_average' },
];

const FORMAT_OPTIONS = [
  { key: 'ALL', label: 'All Formats' },
  { key: 'TEST', label: 'Test' },
  { key: 'ODI', label: 'ODI' },
  { key: 'T20I', label: 'T20I' },
];

export default function LeaderboardScreen({ navigation }) {
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [selectedStat, setSelectedStat] = useState('runs');

  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchRankings = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await getLeaderboard({
        stat: selectedStat,
        format: selectedFormat,
        limit: 20,
      });
      setLeaderboard(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Leaderboard error:', err);
      setError(err.message || 'Could not load rankings');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedFormat, selectedStat]);

  useEffect(() => {
    fetchRankings();
  }, [fetchRankings]);

  const handlePlayerPress = (item) => {
    navigation.navigate('PlayerDetail', {
      playerId: item.player_id,
      playerName: item.name,
    });
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return { text: '🥇', bg: 'rgba(234, 179, 8, 0.2)', border: '#EAB308' };
    if (rank === 2) return { text: '🥈', bg: 'rgba(148, 163, 184, 0.2)', border: '#94A3B8' };
    if (rank === 3) return { text: '🥉', bg: 'rgba(217, 119, 6, 0.2)', border: '#D97706' };
    return { text: `#${rank}`, bg: colors.surfaceLight, border: colors.border };
  };

  const getDisplayStatValue = (item) => {
    switch (selectedStat) {
      case 'runs':
        return item.runs != null ? item.runs.toLocaleString() : '-';
      case 'average':
        return item.average != null ? Number(item.average).toFixed(2) : '-';
      case 'strike_rate':
        return item.strike_rate != null ? Number(item.strike_rate).toFixed(2) : '-';
      case 'hundreds':
        return item.hundreds != null ? item.hundreds : '-';
      case 'wickets':
        return item.wickets != null ? item.wickets : '-';
      case 'economy':
        return item.economy != null ? Number(item.economy).toFixed(2) : '-';
      case 'bowling_average':
        return item.bowling_average != null ? Number(item.bowling_average).toFixed(2) : '-';
      default:
        return item[selectedStat] ?? '-';
    }
  };

  const getStatUnit = () => {
    switch (selectedStat) {
      case 'runs': return 'runs';
      case 'average': return 'avg';
      case 'strike_rate': return 'SR';
      case 'hundreds': return '100s';
      case 'wickets': return 'wkts';
      case 'economy': return 'econ';
      case 'bowling_average': return 'avg';
      default: return '';
    }
  };

  const renderItem = ({ item, index }) => {
    const rank = index + 1;
    const badge = getRankBadge(rank);
    const value = getDisplayStatValue(item);
    const unit = getStatUnit();

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handlePlayerPress(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.rankBox, { backgroundColor: badge.bg, borderColor: badge.border }]}>
          <Text style={styles.rankText}>{badge.text}</Text>
        </View>

        <PlayerAvatar url={item.photo_url} name={item.name} size={48} style={styles.avatar} />

        <View style={styles.info}>
          <Text style={styles.playerName} numberOfLines={1}>
            {item.name}
          </Text>
          <Text style={styles.playerMeta} numberOfLines={1}>
            {item.country} • {item.matches || 0} matches
          </Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statUnit}>{unit}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>🏆 Leaderboards</Text>
        <Text style={styles.subtitle}>All-time top performers across cricket history</Text>
      </View>

      <View style={styles.formatWrapper}>
        <FormatSelector
          formats={FORMAT_OPTIONS}
          selected={selectedFormat}
          onSelect={setSelectedFormat}
        />
      </View>

      <View style={styles.statChipsWrapper}>
        <FilterChips
          options={STAT_OPTIONS}
          selected={selectedStat}
          onSelect={setSelectedStat}
        />
      </View>

      <View style={styles.listContainer}>
        {loading && !refreshing ? (
          <LoadingSpinner message="Calculating all-time rankings..." />
        ) : error ? (
          <ErrorView message={error} onRetry={() => fetchRankings(false)} />
        ) : (
          <FlatList
            data={leaderboard}
            keyExtractor={(item) => `${item.player_id}-${item.name}`}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchRankings(true)}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                icon="trophy-outline"
                title="No leaderboard data"
                message="Try selecting another format or statistical category."
              />
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  subtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  formatWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  statChipsWrapper: {
    marginBottom: spacing.xs,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xxl,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rankBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginRight: spacing.sm,
  },
  rankText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  avatar: {
    marginRight: spacing.md,
  },
  info: {
    flex: 1,
  },
  playerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  playerMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statBox: {
    alignItems: 'flex-end',
    marginLeft: spacing.sm,
  },
  statValue: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  statUnit: {
    fontSize: 10,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
});
