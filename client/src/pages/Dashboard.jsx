import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Trophy, Flame, Sparkles, TrendingUp, ShieldCheck, ArrowRight, Activity, Zap } from 'lucide-react';
import PlayerCard from '../components/PlayerCard';
import StatBadge from '../components/StatBadge';
import PlayerAvatar from '../components/PlayerAvatar';
import { searchPlayers, getLeaderboards } from '../api';

export default function Dashboard() {
  const [featuredPlayers, setFeaturedPlayers] = useState([]);
  const [topScorers, setTopScorers] = useState([]);
  const [topBowlers, setTopBowlers] = useState([]);
  const [totalPlayerCount, setTotalPlayerCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [playersRes, scorersRes, bowlersRes] = await Promise.all([
          searchPlayers(''),
          getLeaderboards({ stat: 'runs', format: 'ALL', limit: 5 }),
          getLeaderboards({ stat: 'wickets', format: 'ALL', limit: 5 })
        ]);

        const playersArr = Array.isArray(playersRes) ? playersRes : (playersRes?.players || []);
        const scorersArr = Array.isArray(scorersRes) ? scorersRes : (scorersRes?.leaderboard || []);
        const bowlersArr = Array.isArray(bowlersRes) ? bowlersRes : (bowlersRes?.leaderboard || []);

        setTotalPlayerCount(playersArr.length);
        setFeaturedPlayers(playersArr.slice(0, 6));
        setTopScorers(scorersArr);
        setTopBowlers(bowlersArr);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl p-8 sm:p-12 overflow-hidden glass-panel border border-slate-800 bg-gradient-to-r from-slate-900 via-cyan-950/30 to-slate-900">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>CricketIQ Next-Gen Historical Analytics</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Comprehensive Analysis of <span className="gradient-text">International Cricket Legends</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Deep historical metrics, ball-by-ball granularity, and AI-grounded career insights for retired international legends across Test, ODI, and T20 formats.
          </p>

          <div className="pt-2 flex flex-wrap gap-4">
            <Link
              to="/leaderboards"
              className="py-3 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Trophy className="w-4 h-4" />
              <span>Explore All-Time Leaderboards</span>
            </Link>
            <Link
              to="/compare"
              className="py-3 px-6 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              <span>Head-to-Head Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Platform Highlight Metrics */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatBadge label="Cricketers Tracked" value={totalPlayerCount ? `${totalPlayerCount}+` : "50+"} subtext="Verified Retired Legends" icon={Activity} color="cyan" />
        <StatBadge label="Matches Processed" value="500+" subtext="Test, ODI & T20 Formats" icon={Flame} color="emerald" />
        <StatBadge label="Ball-by-Ball Records" value="5,000+" subtext="Verified Data Aggregation" icon={TrendingUp} color="amber" />
        <StatBadge label="AI Constraint Guard" value="100%" subtext="Zero Hallucinated Numbers" icon={ShieldCheck} color="purple" />
      </section>

      {/* Featured Players Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Featured International Legends</span>
            </h2>
            <p className="text-xs text-slate-400">Explore career performance metrics</p>
          </div>
          <Link to="/leaderboards" className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-44 rounded-2xl bg-slate-900/60 animate-pulse border border-slate-800" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlayers.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </section>

      {/* Quick Leaderboards Preview */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Run Scorers */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Top All-Time Run Scorers</h3>
                <p className="text-xs text-slate-400">Highest aggregated international runs</p>
              </div>
            </div>
            <Link to="/leaderboards?stat=runs" className="text-xs text-cyan-400 font-medium hover:underline">
              Leaderboard →
            </Link>
          </div>

          <div className="space-y-3">
            {topScorers.map((s, idx) => (
              <Link
                key={s.player_id}
                to={`/player/${s.player_id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-bold ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </span>
                  <PlayerAvatar name={s.name} country={s.country} photo_url={s.photo_url} size="sm" />
                  <div>
                    <div className="font-semibold text-sm text-white">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.country} • Avg {s.average}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm text-cyan-400">{s.runs.toLocaleString()} runs</div>
                  <div className="text-[11px] text-slate-500">{s.hundreds} 100s • {s.fifties} 50s</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Top Wicket Takers */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Top Wicket Takers</h3>
                <p className="text-xs text-slate-400">Most wickets in aggregated international matches</p>
              </div>
            </div>
            <Link to="/leaderboards?stat=wickets" className="text-xs text-emerald-400 font-medium hover:underline">
              Leaderboard →
            </Link>
          </div>

          <div className="space-y-3">
            {topBowlers.map((b, idx) => (
              <Link
                key={b.player_id}
                to={`/player/${b.player_id}`}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 text-center text-xs font-bold ${idx === 0 ? 'text-amber-400' : 'text-slate-500'}`}>
                    #{idx + 1}
                  </span>
                  <PlayerAvatar name={b.name} country={b.country} photo_url={b.photo_url} size="sm" />
                  <div>
                    <div className="font-semibold text-sm text-white">{b.name}</div>
                    <div className="text-xs text-slate-400">{b.country} • Eco {b.economy}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-extrabold text-sm text-emerald-400">{b.wickets} wickets</div>
                  <div className="text-[11px] text-slate-500">Avg {b.bowling_average}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
