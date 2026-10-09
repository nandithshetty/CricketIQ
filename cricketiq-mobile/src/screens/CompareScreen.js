import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '../theme';
import { searchPlayers, comparePlayers } from '../api/players';
import PlayerAvatar from '../components/PlayerAvatar';
import FormatSelector from '../components/FormatSelector';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';

export default function CompareScreen({ route, navigation }) {
  const initialP1 = route?.params?.player1Id || null;
  const initialP2 = route?.params?.player2Id || null;

  const [allPlayers, setAllPlayers] = useState([]);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [selectedFormat, setSelectedFormat] = useState('TEST');

  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Player Selection Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [pickingSlot, setPickingSlot] = useState(1); // 1 or 2
  const [modalSearch, setModalSearch] = useState('');

  // 1. Initial Load: Fetch full player list for picking
  useEffect(() => {
    async function loadDirectory() {
      try {
        const list = await searchPlayers('');
        if (Array.isArray(list) && list.length > 0) {
          setAllPlayers(list);

          // Set initial players if provided via params or default to top 2 (e.g. Sachin & Ponting)
          const p1 = initialP1
            ? list.find((p) => p.id === initialP1)
            : list[0];
          const p2 = initialP2
            ? list.find((p) => p.id === initialP2)
            : (list.length > 1 ? list[1] : null);

          setPlayer1(p1 || null);
          setPlayer2(p2 || null);
        }
      } catch (err) {
        console.error('Failed to load directory for compare:', err);
      }
    }
    loadDirectory();
  }, [initialP1, initialP2]);

  // 2. Fetch Comparison Data whenever player1, player2 or format changes
  const runComparison = useCallback(async () => {
    if (!player1 || !player2) return;
    setLoading(true);
    setError(null);

    try {
      const data = await comparePlayers([player1.id, player2.id]);
      setComparisonData(data);
    } catch (err) {
      console.error('Error fetching comparison:', err);
      setError(err.message || 'Failed to compare selected players');
    } finally {
      setLoading(false);
    }
  }, [player1, player2]);

  useEffect(() => {
    if (player1 && player2) {
      runComparison();
    }
  }, [player1, player2, runComparison]);

  // Extract format-specific stats for Player 1 & Player 2
  const statsP1 = useMemo(() => {
    if (!comparisonData?.players) return null;
    const entry = comparisonData.players.find((p) => p.player.id === player1?.id);
    return entry?.careerStats?.find((s) => s.format.toUpperCase() === selectedFormat.toUpperCase()) || null;
  }, [comparisonData, player1, selectedFormat]);

  const statsP2 = useMemo(() => {
    if (!comparisonData?.players) return null;
    const entry = comparisonData.players.find((p) => p.player.id === player2?.id);
    return entry?.careerStats?.find((s) => s.format.toUpperCase() === selectedFormat.toUpperCase()) || null;
  }, [comparisonData, player2, selectedFormat]);

  const openPicker = (slot) => {
    setPickingSlot(slot);
    setModalSearch('');
    setModalVisible(true);
  };

  const handleSelectPlayer = (selected) => {
    if (pickingSlot === 1) {
      setPlayer1(selected);
    } else {
      setPlayer2(selected);
    }
    setModalVisible(false);
  };

  // Filtered list for the modal picker
  const filteredModalPlayers = useMemo(() => {
    if (!modalSearch.trim()) return allPlayers;
    const q = modalSearch.toLowerCase().trim();
    return allPlayers.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.country && p.country.toLowerCase().includes(q))
    );
  }, [allPlayers, modalSearch]);

  // Helper to determine winner in a metric row
  const getLeader = (val1, val2, lowerIsBetter = false) => {
    const num1 = Number(val1);
    const num2 = Number(val2);
    if (isNaN(num1) || isNaN(num2)) return 0;
    if (num1 === num2) return 0;
    if (lowerIsBetter) {
      if (num1 <= 0 && num2 > 0) return 2;
      if (num2 <= 0 && num1 > 0) return 1;
      return num1 < num2 ? 1 : 2;
    }
    return num1 > num2 ? 1 : 2;
  };

  const METRICS = [
    { key: 'matches', label: 'Matches', lowerIsBetter: false },
    { key: 'runs', label: 'Total Runs', lowerIsBetter: false, highlight: true },
    { key: 'average', label: 'Batting Average', lowerIsBetter: false, highlight: true, format: (v) => v ? Number(v).toFixed(2) : '-' },
    { key: 'strike_rate', label: 'Strike Rate', lowerIsBetter: false, format: (v) => v ? Number(v).toFixed(2) : '-' },
    { key: 'highest_score', label: 'Highest Score', lowerIsBetter: false },
    { key: 'hundreds', label: 'Centuries (100s)', lowerIsBetter: false },
    { key: 'fifties', label: 'Fifties (50s)', lowerIsBetter: false },
    { key: 'wickets', label: 'Wickets', lowerIsBetter: false, highlight: true },
    { key: 'bowling_average', label: 'Bowling Average', lowerIsBetter: true, format: (v) => v ? Number(v).toFixed(2) : '-' },
    { key: 'economy', label: 'Economy Rate', lowerIsBetter: true, format: (v) => v ? Number(v).toFixed(2) : '-' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <Text style={styles.title}>⚔️ Head-to-Head Compare</Text>
        <Text style={styles.subtitle}>Side-by-side career analytics & metric deltas</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Player Selection Cards */}
        <View style={styles.vsRow}>
          {/* Player 1 Box */}
          <TouchableOpacity
            style={styles.playerBox}
            onPress={() => openPicker(1)}
            activeOpacity={0.8}
          >
            <PlayerAvatar url={player1?.photo_url} name={player1?.name} size={64} />
            <Text style={styles.boxPlayerName} numberOfLines={1}>
              {player1 ? player1.name : 'Select Player 1'}
            </Text>
            <Text style={styles.boxCountry}>{player1?.country || 'Tap to choose'}</Text>
            <View style={styles.changeBadge}>
              <Text style={styles.changeBadgeText}>Change</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.vsBadgeContainer}>
            <Text style={styles.vsText}>VS</Text>
          </View>

          {/* Player 2 Box */}
          <TouchableOpacity
            style={styles.playerBox}
            onPress={() => openPicker(2)}
            activeOpacity={0.8}
          >
            <PlayerAvatar url={player2?.photo_url} name={player2?.name} size={64} />
            <Text style={styles.boxPlayerName} numberOfLines={1}>
              {player2 ? player2.name : 'Select Player 2'}
            </Text>
            <Text style={styles.boxCountry}>{player2?.country || 'Tap to choose'}</Text>
            <View style={styles.changeBadge}>
              <Text style={styles.changeBadgeText}>Change</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Format Selector */}
        <View style={styles.formatSection}>
          <FormatSelector
            selected={selectedFormat}
            onSelect={setSelectedFormat}
          />
        </View>

        {/* Comparison Table */}
        {loading ? (
          <LoadingSpinner message="Calculating head-to-head metric deltas..." />
        ) : error ? (
          <ErrorView message={error} onRetry={runComparison} />
        ) : !statsP1 && !statsP2 ? (
          <View style={styles.noDataCard}>
            <Text style={styles.noDataText}>
              Neither cricketer has recorded career data for {selectedFormat}. Try another format.
            </Text>
          </View>
        ) : (
          <View style={styles.tableCard}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCol, { textAlign: 'left' }]} numberOfLines={1}>
                {player1?.name?.split(' ').pop() || 'P1'}
              </Text>
              <Text style={[styles.headerCol, styles.metricHeaderCol]}>METRIC</Text>
              <Text style={[styles.headerCol, { textAlign: 'right' }]} numberOfLines={1}>
                {player2?.name?.split(' ').pop() || 'P2'}
              </Text>
            </View>

            {METRICS.map((metric, idx) => {
              const val1 = statsP1 ? statsP1[metric.key] : null;
              const val2 = statsP2 ? statsP2[metric.key] : null;

              const leader = getLeader(val1, val2, metric.lowerIsBetter);

              const formattedVal1 = metric.format ? metric.format(val1) : (val1 ?? '-');
              const formattedVal2 = metric.format ? metric.format(val2) : (val2 ?? '-');

              return (
                <View
                  key={metric.key}
                  style={[styles.tableRow, idx % 2 === 1 && styles.tableRowAlt]}
                >
                  {/* Player 1 Stat */}
                  <View style={[styles.statCell, { justifyContent: 'flex-start' }]}>
                    <Text
                      style={[
                        styles.statValue,
                        leader === 1 && styles.leaderValue,
                      ]}
                    >
                      {formattedVal1}
                    </Text>
                    {leader === 1 ? (
                      <Ionicons name="trophy" size={12} color={colors.primary} style={{ marginLeft: 4 }} />
                    ) : null}
                  </View>

                  {/* Metric Label */}
                  <View style={styles.metricLabelCell}>
                    <Text
                      style={[
                        styles.metricLabel,
                        metric.highlight && styles.metricLabelHighlight,
                      ]}
                    >
                      {metric.label}
                    </Text>
                  </View>

                  {/* Player 2 Stat */}
                  <View style={[styles.statCell, { justifyContent: 'flex-end' }]}>
                    {leader === 2 ? (
                      <Ionicons name="trophy" size={12} color={colors.primary} style={{ marginRight: 4 }} />
                    ) : null}
                    <Text
                      style={[
                        styles.statValue,
                        leader === 2 && styles.leaderValue,
                      ]}
                    >
                      {formattedVal2}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Player Picker Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <SafeAreaView style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Select Player {pickingSlot}
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalSearchBox}>
              <SearchBar
                value={modalSearch}
                onChangeText={setModalSearch}
                onClear={() => setModalSearch('')}
                placeholder="Search by cricketer name..."
              />
            </View>

            <FlatList
              data={filteredModalPlayers}
              keyExtractor={(item) => String(item.id)}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => handleSelectPlayer(item)}
                >
                  <PlayerAvatar url={item.photo_url} name={item.name} size={44} />
                  <View style={styles.modalItemInfo}>
                    <Text style={styles.modalItemName}>{item.name}</Text>
                    <Text style={styles.modalItemMeta}>
                      {item.country} • {item.role}
                    </Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                </TouchableOpacity>
              )}
            />
          </View>
        </SafeAreaView>
      </Modal>
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
  scrollContent: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  vsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  playerBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  boxPlayerName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    marginTop: spacing.sm,
    textAlign: 'center',
  },
  boxCountry: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
  changeBadge: {
    backgroundColor: 'rgba(6, 182, 212, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: spacing.borderRadius.sm,
    marginTop: spacing.sm,
  },
  changeBadgeText: {
    fontSize: 10,
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
  },
  vsBadgeContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceLight,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  vsText: {
    fontSize: 12,
    fontWeight: typography.fontWeight.bold,
    color: colors.primary,
  },
  formatSection: {
    marginBottom: spacing.md,
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceLight,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerCol: {
    flex: 1,
    fontSize: 11,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  metricHeaderCol: {
    textAlign: 'center',
    color: colors.textMuted,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.04)',
  },
  tableRowAlt: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
  },
  statCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: typography.fontSize.sm,
    color: colors.textSecondary,
    fontWeight: typography.fontWeight.medium,
  },
  leaderValue: {
    color: colors.primary,
    fontWeight: typography.fontWeight.bold,
    fontSize: typography.fontSize.md,
  },
  metricLabelCell: {
    flex: 1.2,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 11,
    color: colors.textMuted,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  metricLabelHighlight: {
    color: colors.text,
    fontWeight: typography.fontWeight.bold,
  },
  noDataCard: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: spacing.borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  noDataText: {
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.background,
  },
  modalContent: {
    flex: 1,
    padding: spacing.md,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  modalTitle: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  modalSearchBox: {
    marginBottom: spacing.md,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: spacing.borderRadius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  modalItemInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  modalItemName: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
  },
  modalItemMeta: {
    fontSize: typography.fontSize.xs,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
