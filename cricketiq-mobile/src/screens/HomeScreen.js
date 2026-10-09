import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, typography } from '../theme';
import { searchPlayers } from '../api/players';
import SearchBar from '../components/SearchBar';
import FilterChips from '../components/FilterChips';
import PlayerCard from '../components/PlayerCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorView from '../components/ErrorView';
import EmptyState from '../components/EmptyState';

const COUNTRY_OPTIONS = [
  { label: 'All Countries', value: 'ALL' },
  { label: 'India', value: 'India' },
  { label: 'Australia', value: 'Australia' },
  { label: 'England', value: 'England' },
  { label: 'Pakistan', value: 'Pakistan' },
  { label: 'South Africa', value: 'South Africa' },
  { label: 'New Zealand', value: 'New Zealand' },
  { label: 'West Indies', value: 'West Indies' },
  { label: 'Sri Lanka', value: 'Sri Lanka' },
];

const ROLE_OPTIONS = [
  { label: 'All Roles', value: 'ALL' },
  { label: 'Batter', value: 'Batter' },
  { label: 'Bowler', value: 'Bowler' },
  { label: 'All-rounder', value: 'All-rounder' },
  { label: 'Wicketkeeper', value: 'Wicketkeeper' },
];

export default function HomeScreen({ navigation }) {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchPlayers = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await searchPlayers('');
      setPlayers(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load players:', err);
      setError(err.message || 'Could not fetch players from server');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  const filteredPlayers = useMemo(() => {
    return players.filter((p) => {
      // Search matching (name or country)
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = p.name && p.name.toLowerCase().includes(q);
        const matchesCountry = p.country && p.country.toLowerCase().includes(q);
        if (!matchesName && !matchesCountry) return false;
      }

      // Country filter
      if (selectedCountry !== 'ALL') {
        if (!p.country || p.country.toLowerCase() !== selectedCountry.toLowerCase()) {
          return false;
        }
      }

      // Role filter
      if (selectedRole !== 'ALL') {
        if (!p.role || !p.role.toLowerCase().includes(selectedRole.toLowerCase())) {
          return false;
        }
      }

      return true;
    });
  }, [players, searchQuery, selectedCountry, selectedRole]);

  const handlePlayerPress = (player) => {
    navigation.navigate('PlayerDetail', {
      playerId: player.id,
      playerName: player.name,
    });
  };

  const renderItem = ({ item }) => (
    <PlayerCard player={item} onPress={() => handlePlayerPress(item)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>🏏 CricketIQ</Text>
          <Text style={styles.brandSubtitle}>
            {players.length > 0 ? `${players.length} Legends & Historical Stats` : 'Cricket Analytics'}
          </Text>
        </View>
      </View>

      <View style={styles.searchWrapper}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
          placeholder="Search by player or team..."
        />
      </View>

      <View style={styles.filtersWrapper}>
        <FilterChips
          options={COUNTRY_OPTIONS}
          selected={selectedCountry}
          onSelect={setSelectedCountry}
        />
        <FilterChips
          options={ROLE_OPTIONS}
          selected={selectedRole}
          onSelect={setSelectedRole}
          style={{ paddingTop: 4 }}
        />
      </View>

      <View style={styles.listContainer}>
        {loading && !refreshing ? (
          <LoadingSpinner message="Loading cricket legends..." />
        ) : error ? (
          <ErrorView message={error} onRetry={() => fetchPlayers(false)} />
        ) : (
          <FlatList
            data={filteredPlayers}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={() => fetchPlayers(true)}
                tintColor={colors.primary}
                colors={[colors.primary]}
              />
            }
            ListEmptyComponent={
              <EmptyState
                title="No cricketers found"
                message="Try tweaking your search keywords or clearing country and role filters."
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: colors.text,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: typography.fontSize.xs,
    color: colors.primary,
    fontWeight: typography.fontWeight.medium,
    marginTop: 2,
  },
  searchWrapper: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.xs,
  },
  filtersWrapper: {
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
});
