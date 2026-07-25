import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Trophy,
  Activity,
  Award,
  Zap,
  Target,
  Globe,
  MapPin,
  Calendar,
  Sparkles,
  GitCompare,
  ArrowLeft
} from 'lucide-react';
import StatBadge from '../components/StatBadge';
import AISummaryCard from '../components/AISummaryCard';
import PlayerAvatar from '../components/PlayerAvatar';
import RunsByYearChart from '../charts/RunsByYearChart';
import FormatRadarChart from '../charts/FormatRadarChart';
import {
  getPlayerProfile,
  getAISummary,
  getPlayerOpposition,
  getPlayerVenues
} from '../api';

export default function PlayerProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [aiSummary, setAiSummary] = useState(null);
  const [opposition, setOpposition] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState('ALL');
  const [activeTab, setActiveTab] = useState('overview'); // overview, opposition, venues, matches
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      try {
        const [profileRes, aiRes, oppRes, venueRes] = await Promise.all([
          getPlayerProfile(id),
          getAISummary(id),
          getPlayerOpposition(id),
          getPlayerVenues(id)
        ]);

        setData(profileRes);
        setAiSummary(aiRes);
        setOpposition(oppRes);
        setVenues(venueRes);
      } catch (err) {
        console.error('Error loading player profile:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse pb-12">
        <div className="h-44 glass-panel rounded-3xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-24 glass-panel rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || !data.player) {
    return (
      <div className="glass-panel rounded-3xl p-12 text-center text-slate-400 space-y-4">
        <h2 className="text-xl font-bold text-white">Player Not Found</h2>
        <p className="text-xs">No historical record matching this ID was found.</p>
        <Link to="/" className="inline-block px-4 py-2 bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  const { player, careerStats = [], timeline, recentMatches } = data;

  // Overall stats = career_stats rows where season is null (aggregate totals per format)
  const overallStats = careerStats.filter((s) => !s.season);

  // Filter career stats by selected format
  const filteredStats =
    selectedFormat === 'ALL'
      ? overallStats
      : overallStats.filter((s) => s.format === selectedFormat);

  // Aggregated stat values across selected format
  const totalMatches = filteredStats.reduce((acc, s) => acc + (s.matches || 0), 0);
  const totalRuns = filteredStats.reduce((acc, s) => acc + (s.runs || 0), 0);
  const total100s = filteredStats.reduce((acc, s) => acc + (s.hundreds || 0), 0);
  const total50s = filteredStats.reduce((acc, s) => acc + (s.fifties || 0), 0);
  const totalWickets = filteredStats.reduce((acc, s) => acc + (s.wickets || 0), 0);
  const maxScore = Math.max(...filteredStats.map((s) => s.highest_score || 0), 0);

  // Primary format for display average & strike rate
  const primaryFormat = filteredStats[0] || overallStats[0] || {};

  return (
    <div className="space-y-8 pb-12">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <PlayerAvatar name={player.name} country={player.country} photo_url={player.photo_url} size="xl" />
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {player.name}
                </h1>
                <span className="px-3 py-1 text-xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-full">
                  {player.country}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-300">{player.role}</p>

              <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                <span>Bat: <strong className="text-slate-200">{player.batting_style}</strong></span>
                <span>Bowl: <strong className="text-slate-200">{player.bowling_style}</strong></span>
              </div>
            </div>
          </div>

          <Link
            to={`/compare?ids=${player.id}`}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-cyan-500/20 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" /> Compare with another player
          </Link>
        </div>
      </div>

      {/* AI Performance Summary */}
      <AISummaryCard
        playerId={player.id}
        initialSummary={aiSummary?.summary}
        generatedAt={aiSummary?.generatedAt}
      />

      {/* Format Selector Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase mr-2">Format:</span>
          {['ALL', 'Test', 'ODI', 'T20'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedFormat(fmt)}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedFormat === fmt
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {fmt === 'ALL' ? 'All Formats' : fmt}
            </button>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Career & Charts
          </button>
          <button
            onClick={() => setActiveTab('opposition')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'opposition' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Vs Opposition
          </button>
          <button
            onClick={() => setActiveTab('venues')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'venues' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Venues
          </button>
          <button
            onClick={() => setActiveTab('matches')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'matches' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Recent Matches
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid (Role-Adaptive) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <StatBadge label="Matches" value={totalMatches} subtext="Appeared" icon={Activity} color="cyan" />
        
        {player.role?.toLowerCase().includes('bowler') ? (
          <>
            <StatBadge label="Total Wickets" value={totalWickets} subtext="Claimed" icon={Zap} color="purple" />
            <StatBadge label="Bowling Avg" value={primaryFormat.bowling_average || '—'} subtext="Runs Per Wicket" icon={Target} color="emerald" />
            <StatBadge label="Economy" value={primaryFormat.economy || '—'} subtext="Runs Per Over" icon={Activity} color="amber" />
            <StatBadge label="Total Runs" value={totalRuns.toLocaleString()} subtext="Aggregated" icon={Trophy} color="cyan" />
            <StatBadge label="Batting Avg" value={primaryFormat.average || '—'} subtext="Dismissal Ratio" icon={Award} color="emerald" />
          </>
        ) : player.role?.toLowerCase().includes('allrounder') ? (
          <>
            <StatBadge label="Total Runs" value={totalRuns.toLocaleString()} subtext="Aggregated" icon={Trophy} color="emerald" />
            <StatBadge label="Batting Avg" value={primaryFormat.average || '—'} subtext="Dismissal Ratio" icon={Target} color="amber" />
            <StatBadge label="Total Wickets" value={totalWickets} subtext="Claimed" icon={Zap} color="purple" />
            <StatBadge label="Bowling Avg" value={primaryFormat.bowling_average || '—'} subtext="Runs Per Wicket" icon={Target} color="emerald" />
            <StatBadge label="Economy" value={primaryFormat.economy || '—'} subtext="Runs Per Over" icon={Activity} color="cyan" />
          </>
        ) : (
          <>
            <StatBadge label="Total Runs" value={totalRuns.toLocaleString()} subtext="Aggregated" icon={Trophy} color="emerald" />
            <StatBadge label="Batting Avg" value={primaryFormat.average || '—'} subtext="Dismissal Ratio" icon={Target} color="amber" />
            <StatBadge label="Strike Rate" value={primaryFormat.strike_rate || '—'} subtext="Per 100 Balls" icon={Zap} color="purple" />
            <StatBadge label="100s / 50s" value={`${total100s} / ${total50s}`} subtext="Milestone Innings" icon={Award} color="cyan" />
            <StatBadge label="Highest Score" value={maxScore} subtext="Best Innings" icon={Trophy} color="emerald" />
          </>
        )}
      </div>

      {/* Tab 1: Overview & Interactive Charts */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Format Summary Table */}
          <div className="glass-panel rounded-2xl p-6 border border-slate-800">
            <h3 className="text-base font-bold text-white mb-4">Format-by-Format Career Breakdown</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-3">Format</th>
                    <th className="p-3">Matches</th>
                    <th className="p-3">Runs</th>
                    <th className="p-3">Avg</th>
                    <th className="p-3">Strike Rate</th>
                    <th className="p-3">100s</th>
                    <th className="p-3">50s</th>
                    <th className="p-3">HS</th>
                    <th className="p-3">Wickets</th>
                    <th className="p-3">B.Avg</th>
                    <th className="p-3">Econ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-medium">
                  {overallStats.map((s) => (
                    <tr key={s.format} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-cyan-400">{s.format}</td>
                      <td className="p-3 text-slate-200">{s.matches}</td>
                      <td className="p-3 text-white font-semibold">{s.runs.toLocaleString()}</td>
                      <td className="p-3 text-emerald-400 font-semibold">{s.average}</td>
                      <td className="p-3 text-amber-400">{s.strike_rate}</td>
                      <td className="p-3 text-slate-300">{s.hundreds}</td>
                      <td className="p-3 text-slate-300">{s.fifties}</td>
                      <td className="p-3 text-slate-200">{s.highest_score}</td>
                      <td className="p-3 text-cyan-300 font-semibold">{s.wickets}</td>
                      <td className="p-3 text-slate-400">{s.bowling_average || '—'}</td>
                      <td className="p-3 text-slate-400">{s.economy || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Visualizations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-2">Yearly Performance Trajectory</h3>
              <p className="text-xs text-slate-400 mb-4">Total runs scored and wickets claimed per calendar year</p>
              <RunsByYearChart timeline={timeline} />
            </div>

            <div className="glass-panel rounded-2xl p-6 border border-slate-800">
              <h3 className="text-base font-bold text-white mb-2">Format Attribute Radar</h3>
              <p className="text-xs text-slate-400 mb-4">Multi-dimensional skill rating across Test, ODI & T20</p>
              <FormatRadarChart careerStats={careerStats} />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Opposition Analysis */}
      {activeTab === 'opposition' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" /> Performance Breakdown by Opposition Team
          </h3>
          <p className="text-xs text-slate-400 mb-6">Real historical record against international teams &bull; <span className="text-cyan-500">Source: ESPNcricinfo Statsguru</span></p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Opposition Team</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Matches</th>
                  <th className="p-3">Innings</th>
                  <th className="p-3">Total Runs</th>
                  <th className="p-3">Batting Avg</th>
                  <th className="p-3">Highest Score</th>
                  <th className="p-3">100s</th>
                  <th className="p-3">50s</th>
                  <th className="p-3">Wickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {opposition.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="p-4 text-center text-slate-500">
                      No opposition breakdown records available.
                    </td>
                  </tr>
                ) : (
                  opposition.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{item.team_name}</td>
                      <td className="p-3 text-cyan-400">{item.format}</td>
                      <td className="p-3 text-slate-200">{item.matches}</td>
                      <td className="p-3 text-slate-300">{item.innings || '—'}</td>
                      <td className="p-3 text-emerald-400 font-semibold">{item.total_runs?.toLocaleString()}</td>
                      <td className="p-3 text-amber-400 font-semibold">{item.average}</td>
                      <td className="p-3 text-slate-200">{item.highest_score}</td>
                      <td className="p-3 text-yellow-400 font-semibold">{item.hundreds || 0}</td>
                      <td className="p-3 text-slate-300">{item.fifties || 0}</td>
                      <td className="p-3 text-cyan-300 font-semibold">{item.total_wickets}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Venue Analysis */}
      {activeTab === 'venues' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" /> Venue Performance Breakdown
          </h3>
          <p className="text-xs text-slate-400 mb-6">Historical record across global international stadiums</p>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Stadium Venue</th>
                  <th className="p-3">Matches</th>
                  <th className="p-3">Total Runs</th>
                  <th className="p-3">Batting Avg</th>
                  <th className="p-3">Highest Score</th>
                  <th className="p-3">Wickets</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-medium">
                {venues.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-500">
                      No venue data available.
                    </td>
                  </tr>
                ) : (
                  venues.map((v, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40">
                      <td className="p-3 font-bold text-white">{v.venue}</td>
                      <td className="p-3 text-slate-200">{v.matches}</td>
                      <td className="p-3 text-emerald-400 font-semibold">{v.total_runs?.toLocaleString()}</td>
                      <td className="p-3 text-amber-400 font-semibold">{v.batting_avg}</td>
                      <td className="p-3 text-slate-300">{v.highest_score}</td>
                      <td className="p-3 text-cyan-300 font-semibold">{v.total_wickets}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Recent Match Logs */}
      {activeTab === 'matches' && (
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" /> Recent Match Performance Log
          </h3>
          <p className="text-xs text-slate-400 mb-6">Last 10 match innings statistics</p>

          <div className="space-y-3">
            {recentMatches.map((m) => (
              <div
                key={m.match_id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800 gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                      {m.format}
                    </span>
                    <span className="font-semibold text-sm text-white">
                      {m.home_team} vs {m.away_team}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(m.match_date).toLocaleDateString()} • {m.venue}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs">
                  <div>
                    <div className="text-slate-400 text-[10px]">Batting</div>
                    <div className="font-bold text-white">
                      {m.runs} ({m.balls_faced}b) <span className="text-slate-400 font-normal">{m.dismissal_type}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-[10px]">Bowling</div>
                    <div className="font-bold text-emerald-400">
                      {m.wickets}/{m.runs_conceded} ({m.overs_bowled} ov)
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
