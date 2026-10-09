import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { getPlayerProfile, getPlayerOpposition } from '../api/players';
import { getAISummary } from '../api/insights';
import PlayerAvatar from '../components/PlayerAvatar';
import FormatSelector from '../components/FormatSelector';
import StatCard from '../components/StatCard';
import AIInsightCard from '../components/AIInsightCard';
import OppositionTable from '../components/OppositionTable';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';

export default function PlayerDetailScreen({ route, navigation }) {
  const { playerId, playerName } = route.params;

  const [profile, setProfile] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('TEST');
  const [oppositionData, setOppositionData] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [aiGroundedStats, setAiGroundedStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfileData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getPlayerProfile(playerId);
      setProfile(data);

      // Auto-select first format that exists in career stats
      if (data?.careerStats && data.careerStats.length > 0) {
        const availableFormats = data.careerStats.map((s) => s.format.toUpperCase());
        if (availableFormats.includes('TEST')) {
          setSelectedFormat('TEST');
        } else if (availableFormats.length > 0) {
          setSelectedFormat(availableFormats[0]);
        }
      }

      // Fetch opposition stats in background
      try {
        const oppData = await getPlayerOpposition(playerId);
        setOppositionData(Array.isArray(oppData) ? oppData : []);
      } catch (e) {
        console.log('Opposition stats not available:', e.message);
      }

      // Fetch AI summary
      fetchAiInsight(false);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Failed to load player details');
    } finally {
      setLoading(false);
    }
  }, [playerId]);

  const fetchAiInsight = async (forceRefresh = false) => {
    setAiLoading(true);
    try {
      const res = await getAISummary(playerId, forceRefresh);
      if (res) {
        setAiSummary(res.summary);
        setAiGroundedStats(res.groundedStats);
      }
    } catch (err) {
      console.log('AI summary error:', err.message);
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const player = profile?.player;
  const careerStatsList = profile?.careerStats || [];

  // Available formats list (deduplicated)
  const formatOptions = useMemo(() => {
    const unique = [];
    const seen = new Set();
    for (const s of careerStatsList) {
      const fmt = s.format?.toUpperCase();
      if (fmt && !seen.has(fmt)) {
        seen.add(fmt);
        unique.push({ key: fmt, label: fmt });
      }
    }
    return unique.length > 0
      ? unique
      : [
          { key: 'TEST', label: 'TEST' },
          { key: 'ODI', label: 'ODI' },
          { key: 'T20I', label: 'T20I' },
        ];
  }, [careerStatsList]);

  // Current selected format stats
  const currentStats = useMemo(() => {
    return careerStatsList.find(
      (s) => s.format.toUpperCase() === selectedFormat.toUpperCase()
    );
  }, [careerStatsList, selectedFormat]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner message={`Loading ${playerName || 'player'} profile...`} />
      </SafeAreaView>
    );
  }

  if (error || !player) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorView message={error || 'Player not found'} onRetry={fetchProfileData} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Top Navbar */}
      <View style={styles.navBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          style={styles.navBackButton}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.navTitle} numberOfLines={1}>
          {player.name}
        </Text>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Compare', {
              player1Id: player.id,
            })
          }
          style={styles.compareNavButton}
        >
          <Ionicons name="git-compare-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Hero Card */}
        <View style={styles.heroCard}>
          <PlayerAvatar
            url={player.photo_url}
            name={player.name}
            size={90}
            style={styles.heroAvatar}
          />

          <View style={styles.heroInfo}>
            <View style={styles.heroHeaderRow}>
              <Text style={styles.heroName}>{player.name}</Text>
            </View>

            <View style={styles.badgeRow}>
              <View style={styles.countryBadge}>
                <Text style={styles.countryBadgeText}>{player.country}</Text>
              </View>
              <View style={styles.roleBadge}>
                <Text style={styles.roleBadgeText}>{player.role || 'Player'}</Text>
              </View>
            </View>

            <View style={styles.detailsGrid}>
              {player.batting_style ? (
                <Text style={styles.detailText}>🏏 {player.batting_style}</Text>
              ) : null}
              {player.bowling_style ? (
                <Text style={styles.detailText}>🎯 {player.bowling_style}</Text>
              ) : null}
              {player.dob ? <Text style={styles.detailText}>📅 Born: {player.dob}</Text> : null}
            </View>
          </View>
        </View>

        {/* Format Selector */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CAREER FORMAT</Text>
          <FormatSelector
            formats={formatOptions}
            selected={selectedFormat}
            onSelect={setSelectedFormat}
          />
        </View>

        {/* Key Career Stats Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{selectedFormat} CAREER STATISTICS</Text>

          {currentStats ? (
            <View style={styles.statsGrid}>
              <StatCard
                label="Matches"
                value={currentStats.matches}
                style={styles.gridItem}
              />
              <StatCard
                label="Innings"
                value={currentStats.innings}
                style={styles.gridItem}
              />
              <StatCard
                label="Runs"
                value={currentStats.runs}
                highlight
                style={styles.gridItem}
              />
              <StatCard
                label="Batting Avg"
                value={currentStats.average != null ? Number(currentStats.average).toFixed(2) : '-'}
                highlight
                style={styles.gridItem}
              />
              <StatCard
                label="Strike Rate"
                value={currentStats.strike_rate != null ? Number(currentStats.strike_rate).toFixed(2) : '-'}
                style={styles.gridItem}
              />
              <StatCard
                label="High Score"
                value={currentStats.highest_score}
                style={styles.gridItem}
              />
              <StatCard
                label="100s"
                value={currentStats.hundreds}
                style={styles.gridItem}
              />
              <StatCard
                label="50s"
                value={currentStats.fifties}
                style={styles.gridItem}
              />
              <StatCard
                label="Wickets"
                value={currentStats.wickets}
                highlight={currentStats.wickets > 0}
                style={styles.gridItem}
              />
              <StatCard
                label="Bowl Avg"
                value={currentStats.bowling_average != null ? Number(currentStats.bowling_average).toFixed(2) : '-'}
                style={styles.gridItem}
              />
              <StatCard
                label="Economy"
                value={currentStats.economy != null ? Number(currentStats.economy).toFixed(2) : '-'}
                style={styles.gridItem}
              />
              <StatCard
                label="Best Bowling"
                value={currentStats.best_bowling || '-'}
                style={styles.gridItem}
              />
            </View>
          ) : (
            <View style={styles.noStatsBox}>
              <Text style={styles.noStatsText}>
                No official {selectedFormat} career record for this player.
              </Text>
            </View>
          )}
        </View>

        {/* AI Performance Summary */}
        <View style={styles.section}>
          <AIInsightCard
            summary={aiSummary}
            groundedStats={aiGroundedStats}
            loading={aiLoading}
            onRefresh={() => fetchAiInsight(true)}
          />
        </View>

        {/* Opposition Breakdown */}
        {oppositionData.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>OPPOSITION SPLITS</Text>
            <OppositionTable data={oppositionData} />
          </View>
        ) : null}

        {/* Compare CTA */}
        <TouchableOpacity
          style={styles.compareCtaButton}
          onPress={() =>
            navigation.navigate('Compare', {
              player1Id: player.id,
            })
          }
          activeOpacity={0.8}
        >
          <Ionicons name="git-compare-outline" size={20} color="#0F172A" style={{ marginRight: 8 }} />
          <Text style={styles.compareCtaText}>Compare with another Legend</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  navBackButton: {
    padding: 4,
  },
  navTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
    marginHorizontal: spacing.sm,
  },
  compareNavButton: {
    padding: 6,
    borderRadius: spacing.borderRadius.sm,
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
  },
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  heroAvatar: {
    marginRight: spacing.md,
  },
  heroInfo: {
    flex: 1,
  },
  heroHeaderRow: {
    marginBottom: spacing.xs,
  },
  heroName: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.xs,
  },
  countryBadge: {
    backgroundColor: 'rgba(56, 189, 248, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  countryBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.secondary,
    fontWeight: typography.fontWeight.semiBold,
  },
  roleBadge: {
    backgroundColor: colors.surfaceLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.sm,
  },
  roleBadgeText: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  detailsGrid: {
    gap: 2,
    marginTop: 2,
  },
  detailText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  gridItem: {
    flexBasis: '31%',
    flexGrow: 1,
  },
  noStatsBox: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  noStatsText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  compareCtaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  compareCtaText: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: '#0F172A',
  },
});
