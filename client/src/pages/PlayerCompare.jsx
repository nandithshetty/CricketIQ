import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { GitCompare, Search, X, Trophy, Zap, Target, Award, UserPlus, Plus } from 'lucide-react';
import ComparisonBarChart from '../charts/ComparisonBarChart';
import PlayerAvatar from '../components/PlayerAvatar';
import { searchPlayers, comparePlayers } from '../api';

export default function PlayerCompare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparedPlayers, setComparedPlayers] = useState([]);
  const [format, setFormat] = useState('ODI');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [allPlayersList, setAllPlayersList] = useState([]);
  const [selectedDropdownId, setSelectedDropdownId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initAllPlayers() {
      try {
        const res = await searchPlayers('');
        const arr = Array.isArray(res) ? res : (res?.players || []);
        setAllPlayersList(arr);
      } catch (err) {
        console.error('Failed to load players list:', err);
      }
    }
    initAllPlayers();
  }, []);

  useEffect(() => {
    const idsParam = searchParams.get('ids') || searchParams.get('players');
    if (idsParam) {
      const idsArr = idsParam.split(',').filter(Boolean);
      setSelectedIds(idsArr);
    } else if (allPlayersList.length >= 2) {
      const defaultIds = [String(allPlayersList[0].id), String(allPlayersList[1].id)];
      setSelectedIds(defaultIds);
      setSearchParams({ ids: defaultIds.join(',') });
    }
  }, [searchParams, allPlayersList]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      setComparedPlayers([]);
      return;
    }

    async function loadComparison() {
      setLoading(true);
      try {
        const res = await comparePlayers(selectedIds);
        const arr = Array.isArray(res) ? res : (res?.players || []);
        setComparedPlayers(arr);
      } catch (err) {
        console.error('Error fetching comparison:', err);
      } finally {
        setLoading(false);
      }
    }

    loadComparison();
  }, [selectedIds]);

  const handleAddPlayer = (playerObj) => {
    const pId = String(playerObj.id);
    if (selectedIds.includes(pId)) return;
    if (selectedIds.length >= 3) return;

    const newIds = [...selectedIds, pId];
    setSelectedIds(newIds);
    setSearchParams({ ids: newIds.join(',') });
    setSearchQuery('');
    setSearchResults([]);
    setSelectedDropdownId('');
  };

  const handleRemovePlayer = (idToRemove) => {
    const newIds = selectedIds.filter((id) => String(id) !== String(idToRemove));
    setSelectedIds(newIds);
    setSearchParams({ ids: newIds.join(',') });
  };

  const handleSearchChange = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await searchPlayers(query);
      const arr = Array.isArray(res) ? res : (res?.players || []);
      setSearchResults(arr.slice(0, 5));
    } catch (e) {}
  };

  const handleSearchSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await searchPlayers(searchQuery);
      const arr = Array.isArray(res) ? res : (res?.players || []);
      if (arr.length > 0) {
        handleAddPlayer(arr[0]);
      }
    } catch (err) {
      console.error('Search submit failed:', err);
    }
  };

  const handleDropdownSelect = (e) => {
    const pId = e.target.value;
    if (!pId) return;
    const found = allPlayersList.find((p) => String(p.id) === String(pId));
    if (found) handleAddPlayer(found);
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <GitCompare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Head-to-Head Player Comparison
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
          Compare aggregated career metrics, batting averages, strike rates, centuries, and bowling statistics between up to 3 retired international cricket legends.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-800 space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-semibold text-slate-400 uppercase mr-1">Comparing ({comparedPlayers.length}/3):</span>
            {comparedPlayers.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-white text-xs font-semibold shadow-md"
              >
                <PlayerAvatar name={p.name} country={p.country} size="xs" />
                <span>{p.name} ({p.country})</span>
                {selectedIds.length > 1 && (
                  <button onClick={() => handleRemovePlayer(p.id)} className="text-slate-400 hover:text-rose-400 ml-1">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="relative">
              <select
                value={selectedDropdownId}
                onChange={handleDropdownSelect}
                disabled={selectedIds.length >= 3}
                className="bg-slate-900 border border-cyan-500/50 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-400 min-w-[220px] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">{selectedIds.length >= 3 ? '✓ 3 players selected (max)' : `+ Choose Player from List (${allPlayersList.length})...`}</option>
                {allPlayersList
                  .filter((p) => !selectedIds.includes(String(p.id)))
                  .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.country} • {p.role})
                    </option>
                  ))}
              </select>
            </div>

            <span className="text-xs text-slate-500 font-semibold">OR</span>

            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 flex-1 max-w-md relative">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  disabled={selectedIds.length >= 3}
                  placeholder={selectedIds.length >= 3 ? '3 players selected (max)' : 'Type cricketer name (e.g., Sachin Tendulkar)...'}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={selectedIds.length >= 3}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md flex items-center gap-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>

              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 mt-1 w-full glass-panel bg-slate-900/95 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                  {searchResults.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleAddPlayer(r)}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-slate-200 hover:bg-slate-800 flex items-center justify-between border-b border-slate-800/60 last:border-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <PlayerAvatar name={r.name} country={r.country} size="sm" />
                        <div>
                          <div className="font-semibold text-white">{r.name}</div>
                          <div className="text-[10px] text-slate-400">{r.country} • {r.role}</div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
                        <Plus className="w-3 h-3" /> Select
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </form>
          </div>

          {allPlayersList.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                Quick Add Popular Cricketers:
              </div>
              <div className="flex flex-wrap gap-2">
                {allPlayersList
                  .filter((p) => !selectedIds.includes(String(p.id)))
                  .slice(0, 10)
                  .map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleAddPlayer(p)}
                      className="px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-medium flex items-center gap-1.5 transition-all"
                    >
                      <PlayerAvatar name={p.name} country={p.country} size="sm" />
                      <span>+ {p.name}</span>
                    </button>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
        <span className="text-xs font-semibold text-slate-400 uppercase mr-2">Format:</span>
        {['ALL', 'Test', 'ODI', 'T20'].map((fmt) => (
          <button
            key={fmt}
            onClick={() => setFormat(fmt)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              format === fmt
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {fmt === 'ALL' ? 'All Formats' : fmt}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map((n) => (
            <div key={n} className="h-64 glass-panel rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : comparedPlayers.length === 0 ? (
        <div className="glass-panel rounded-2xl p-12 text-center space-y-4 border border-slate-800">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
            <UserPlus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-white">Select Players to Compare</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Choose cricketers using the dropdown menu or quick buttons above to compare their head-to-head career metrics.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparedPlayers.map((p) => {
              let f = null;
              if (p.formats) {
                if (format === 'ALL') {
                  const allFmts = Object.values(p.formats).filter(Boolean);
                  if (allFmts.length > 0) {
                    const m = allFmts.reduce((acc, x) => acc + (x.matches || 0), 0);
                    const r = allFmts.reduce((acc, x) => acc + (x.runs || 0), 0);
                    const w = allFmts.reduce((acc, x) => acc + (x.wickets || 0), 0);
                    const h = allFmts.reduce((acc, x) => acc + (x.hundreds || 0), 0);
                    const fif = allFmts.reduce((acc, x) => acc + (x.fifties || 0), 0);
                    const avg = m > 0 ? Number((r / (m * 0.85)).toFixed(2)) : 0;
                    const sr = Number((allFmts.reduce((acc, x) => acc + (x.strike_rate || 0), 0) / allFmts.length).toFixed(2));
                    f = { matches: m, runs: r, wickets: w, hundreds: h, fifties: fif, average: avg, strike_rate: sr };
                  }
                } else {
                  f = p.formats[format];
                }
              }

              return (
                <div key={p.id} className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4 relative overflow-hidden">
                  <div className="flex items-center gap-4">
                    <PlayerAvatar name={p.name} country={p.country} photo_url={p.photo_url} size="lg" />
                    <div>
                      <h3 className="font-bold text-lg text-white">{p.name}</h3>
                      <div className="text-xs text-cyan-400 font-semibold">{p.country} • {p.role}</div>
                    </div>
                  </div>

                  {!f ? (
                    <div className="py-6 text-center text-xs text-slate-500 italic bg-slate-950/40 rounded-xl border border-slate-800">
                      Did not play {format === 'ALL' ? 'international' : format} matches
                    </div>
                  ) : (() => {
                    const role = (p.role || '').toLowerCase();
                    const isBowler = role.includes('bowler');
                    const isAllrounder = role.includes('allrounder');

                    return (
                      <div className="space-y-2.5 pt-3 border-t border-slate-800 text-xs font-medium">
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Matches Played</span>
                          <span className="font-bold text-white text-sm">{f.matches}</span>
                        </div>

                        {/* BOWLER: highlight bowling stats first */}
                        {isBowler && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Wickets</span>
                              <span className="font-bold text-purple-400 text-sm">{f.wickets}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Bowling Avg</span>
                              <span className="font-bold text-emerald-400 text-sm">{f.bowling_average || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Economy</span>
                              <span className="font-bold text-amber-400 text-sm">{f.economy || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Total Runs</span>
                              <span className="font-bold text-cyan-400 text-sm">{f.runs?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Batting Avg</span>
                              <span className="font-bold text-slate-300 text-sm">{f.average}</span>
                            </div>
                          </>
                        )}

                        {/* ALLROUNDER: both batting and bowling */}
                        {isAllrounder && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Total Runs</span>
                              <span className="font-bold text-cyan-400 text-sm">{f.runs?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Batting Avg</span>
                              <span className="font-bold text-emerald-400 text-sm">{f.average}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Wickets</span>
                              <span className="font-bold text-purple-400 text-sm">{f.wickets}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Bowling Avg</span>
                              <span className="font-bold text-amber-400 text-sm">{f.bowling_average || '—'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Economy</span>
                              <span className="font-bold text-slate-300 text-sm">{f.economy || '—'}</span>
                            </div>
                          </>
                        )}

                        {/* BATTER / WICKETKEEPER / OPENER: batting stats only */}
                        {!isBowler && !isAllrounder && (
                          <>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Total Runs</span>
                              <span className="font-bold text-cyan-400 text-sm">{f.runs?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Batting Avg</span>
                              <span className="font-bold text-emerald-400 text-sm">{f.average}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Strike Rate</span>
                              <span className="font-bold text-amber-400 text-sm">{f.strike_rate}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Centuries</span>
                              <span className="font-bold text-white text-sm">{f.hundreds}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Fifties</span>
                              <span className="font-bold text-slate-300 text-sm">{f.fifties}</span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>

          {/* Visual Comparison Bar Chart */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-1">Visual Metric Breakdown ({format === 'ALL' ? 'All Formats' : format})</h3>
            <p className="text-xs text-slate-400 mb-4">Comparative bar chart across Runs, Average, Strike Rate & Wickets</p>
            <ComparisonBarChart players={comparedPlayers} selectedFormat={format} />
          </div>
        </div>
      )}
    </div>
  );
}
