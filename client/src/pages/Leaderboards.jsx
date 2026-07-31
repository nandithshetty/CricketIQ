import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Trophy, Filter, ArrowUpDown, Award, Flame, Zap } from 'lucide-react';
import { getLeaderboards } from '../api';
import PlayerAvatar from '../components/PlayerAvatar';

export default function Leaderboards() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statParam = searchParams.get('stat') || 'runs';
  const formatParam = searchParams.get('format') || 'ALL';
  const seasonParam = searchParams.get('season') || 'ALL';

  const [stat, setStat] = useState(statParam);
  const [format, setFormat] = useState(formatParam);
  const [season, setSeason] = useState(seasonParam);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await getLeaderboards({ stat, format, season, limit: 30 });
        setLeaderboard(Array.isArray(data) ? data : (data?.leaderboard || []));
      } catch (err) {
        console.error('Leaderboard error:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
    setSearchParams({ stat, format, season });
  }, [stat, format, season]);

  const statLabels = {
    runs: 'Most Runs',
    average: 'Highest Batting Average',
    strike_rate: 'Best Strike Rate',
    wickets: 'Most Wickets',
    bowling_average: 'Best Bowling Average',
    economy: 'Best Economy Rate',
    hundreds: 'Most Centuries (100s)',
    fifties: 'Most Half-Centuries (50s)',
    highest_score: 'Highest Score'
  };

  const isBowlingStat = ['wickets', 'bowling_average', 'economy'].includes(stat);
  const isMilestoneStat = ['hundreds', 'fifties', 'highest_score'].includes(stat);

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Global Player Leaderboards</h1>
            <p className="text-xs text-slate-400">Ranked international performance records across all formats & seasons</p>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Select Metric</label>
            <select
              value={stat}
              onChange={(e) => setStat(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="runs">Most Runs</option>
              <option value="average">Highest Batting Average</option>
              <option value="strike_rate">Best Strike Rate</option>
              <option value="wickets">Most Wickets</option>
              <option value="bowling_average">Best Bowling Average</option>
              <option value="economy">Best Economy Rate</option>
              <option value="hundreds">Most Centuries (100s)</option>
              <option value="fifties">Most Half-Centuries (50s)</option>
              <option value="highest_score">Highest Score</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Format</label>
            <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
              {['ALL', 'Test', 'ODI', 'T20'].map((f) => (
                <button
                  key={f}
                  onClick={() => setFormat(f)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    format === f ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1.5">Season / Era</label>
            <select
              value={season}
              onChange={(e) => setSeason(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-semibold text-slate-100 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All-Time Career</option>
              <option value="2010s">2010s Era (2010–2019)</option>
              <option value="2000s">2000s Era (2000–2009)</option>
              <option value="1990s">1990s Era (1990–1999)</option>
              <option value="1980s">1980s Era (1980–1989)</option>
              <option value="1970s">1970s Era (1970–1979)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-cyan-400" /> {statLabels[stat] || 'Leaderboard Rankings'}
          </h3>
          <span className="text-xs text-slate-400 font-medium">Showing top {leaderboard.length} qualifiers</span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-500">
            <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            Fetching rankings...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Rank</th>
                  <th className="p-3">Player</th>
                  <th className="p-3">Country</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Matches</th>
                  <th className="p-3 text-cyan-400 font-bold">{statLabels[stat] || 'Metric Value'}</th>
                  {isBowlingStat ? (
                    <>
                      <th className="p-3">Wickets</th>
                      <th className="p-3">Bowling Avg</th>
                      <th className="p-3">Economy</th>
                      <th className="p-3">Runs</th>
                    </>
                  ) : isMilestoneStat ? (
                    <>
                      <th className="p-3">Total Runs</th>
                      <th className="p-3">Batting Avg</th>
                      <th className="p-3">100s</th>
                      <th className="p-3">50s</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3">Runs</th>
                      <th className="p-3">Batting Avg</th>
                      <th className="p-3">Strike Rate</th>
                      <th className="p-3">Wickets</th>
                    </>
                  )}
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {leaderboard.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="p-8 text-center text-slate-500">
                      No records matched the chosen filter parameters.
                    </td>
                  </tr>
                ) : (
                  leaderboard.map((row, idx) => (
                    <tr key={row.player_id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-3 font-bold">
                        {idx === 0 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/40">#1</span>
                        ) : idx === 1 ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-400/20 text-slate-300 border border-slate-400/40">#2</span>
                        ) : idx === 2 ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-700/20 text-amber-500 border border-amber-700/40">#3</span>
                        ) : (
                          <span className="text-slate-500">#{idx + 1}</span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <PlayerAvatar name={row.name} country={row.country} photo_url={row.photo_url} size="sm" />
                          <div>
                            <div className="font-semibold text-white">{row.name}</div>
                            <div className="text-[10px] text-slate-400">{row.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-slate-300">{row.country}</td>
                      <td className="p-3 text-cyan-400 font-semibold">{row.format || 'All'}</td>
                      <td className="p-3 text-slate-300">{row.matches}</td>
                      <td className="p-3 font-extrabold text-sm text-cyan-300">
                        {stat === 'runs' && (row.runs != null ? Number(row.runs).toLocaleString() : '-')}
                        {stat === 'average' && (row.average != null ? row.average : '-')}
                        {stat === 'strike_rate' && (row.strike_rate != null ? row.strike_rate : '-')}
                        {stat === 'wickets' && (row.wickets != null ? Number(row.wickets).toLocaleString() : '-')}
                        {stat === 'bowling_average' && (row.wickets > 0 && row.bowling_average != null ? row.bowling_average : 'N/A')}
                        {stat === 'economy' && (row.wickets > 0 && row.economy != null ? row.economy : 'N/A')}
                        {stat === 'hundreds' && (row.hundreds != null ? row.hundreds : '-')}
                        {stat === 'fifties' && (row.fifties != null ? row.fifties : '-')}
                        {stat === 'highest_score' && (row.highest_score != null ? row.highest_score : '-')}
                      </td>
                      {isBowlingStat ? (
                        <>
                          <td className="p-3 text-purple-400 font-semibold">{row.wickets != null ? Number(row.wickets).toLocaleString() : '-'}</td>
                          <td className="p-3 text-emerald-400">{row.wickets > 0 && row.bowling_average != null ? row.bowling_average : 'N/A'}</td>
                          <td className="p-3 text-amber-400">{row.wickets > 0 && row.economy != null ? row.economy : 'N/A'}</td>
                          <td className="p-3 text-slate-300">{row.runs != null ? Number(row.runs).toLocaleString() : '-'}</td>
                        </>
                      ) : isMilestoneStat ? (
                        <>
                          <td className="p-3 text-slate-300">{row.runs != null ? Number(row.runs).toLocaleString() : '-'}</td>
                          <td className="p-3 text-emerald-400">{row.average != null ? row.average : '-'}</td>
                          <td className="p-3 text-amber-400 font-semibold">{row.hundreds != null ? row.hundreds : '-'}</td>
                          <td className="p-3 text-cyan-400 font-semibold">{row.fifties != null ? row.fifties : '-'}</td>
                        </>
                      ) : (
                        <>
                          <td className="p-3 text-slate-300">{row.runs != null ? Number(row.runs).toLocaleString() : '-'}</td>
                          <td className="p-3 text-emerald-400">{row.average != null ? row.average : '-'}</td>
                          <td className="p-3 text-amber-400">{row.strike_rate != null ? row.strike_rate : '-'}</td>
                          <td className="p-3 text-purple-400">{row.wickets != null ? Number(row.wickets).toLocaleString() : '-'}</td>
                        </>
                      )}
                      <td className="p-3">
                        <Link to={`/player/${row.player_id}`} className="text-xs font-semibold text-cyan-400 hover:underline">
                          Profile →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
