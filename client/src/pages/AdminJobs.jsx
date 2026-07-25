import React, { useEffect, useState } from 'react';
import { Cpu, RefreshCw, Play, CheckCircle2, Clock, AlertTriangle, Database, Zap } from 'lucide-react';
import { triggerAdminImport, getAdminJobs, getCacheStats } from '../api';

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [cacheStats, setCacheStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [triggering, setTriggering] = useState(false);
  const [message, setMessage] = useState('');

  const loadJobsData = async () => {
    setLoading(true);
    try {
      const [jobsData, cacheData] = await Promise.all([getAdminJobs(), getCacheStats()]);
      setJobs(jobsData);
      setCacheStats(cacheData);
    } catch (err) {
      console.error('Failed to load admin jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobsData();
    const interval = setInterval(loadJobsData, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleTriggerJob = async (type) => {
    setTriggering(true);
    setMessage('');
    try {
      const res = await triggerAdminImport(type);
      setMessage(`Job #${res.jobId} [${type}] queued successfully.`);
      await loadJobsData();
    } catch (err) {
      setMessage('Failed to queue background job.');
    } finally {
      setTriggering(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Background Processing & Jobs Queue</h1>
              <p className="text-xs text-slate-400">Asynchronous MySQL jobs worker & in-memory cache monitoring</p>
            </div>
          </div>

          <button
            onClick={loadJobsData}
            disabled={loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh Status
          </button>
        </div>

        {/* Trigger Controls */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-800">
          <button
            onClick={() => handleTriggerJob('career_stats_recompute')}
            disabled={triggering}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5" /> Recompute All Career Stats
          </button>

          <button
            onClick={() => handleTriggerJob('ai_summary_regenerate')}
            disabled={triggering}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" /> Regenerate AI Summaries
          </button>

          <button
            onClick={() => handleTriggerJob('data_import')}
            disabled={triggering}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-slate-950 font-bold text-xs shadow-md shadow-purple-500/20 transition-all disabled:opacity-50"
          >
            <Database className="w-3.5 h-3.5" /> Trigger Full Data Re-import
          </button>
        </div>

        {message && (
          <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            {message}
          </div>
        )}
      </div>

      {/* Cache Health Metrics */}
      {cacheStats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">In-Memory Cache Size</div>
            <div className="text-2xl font-extrabold text-white mt-1">{cacheStats.size} items</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Cache Hit Rate</div>
            <div className="text-2xl font-extrabold text-cyan-400 mt-1">{cacheStats.hitRate}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Cache Hits</div>
            <div className="text-2xl font-extrabold text-emerald-400 mt-1">{cacheStats.hits}</div>
          </div>
          <div className="glass-panel p-4 rounded-2xl border border-slate-800">
            <div className="text-xs text-slate-400 font-medium">Cache Misses</div>
            <div className="text-2xl font-extrabold text-slate-400 mt-1">{cacheStats.misses}</div>
          </div>
        </div>
      )}

      {/* Job Queue Table */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <h3 className="text-lg font-bold text-white mb-4">Background Jobs Processing Log</h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Job ID</th>
                <th className="p-3">Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Attempts</th>
                <th className="p-3">Error Message</th>
                <th className="p-3">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {jobs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-6 text-center text-slate-500">
                    No background jobs have been queued yet.
                  </td>
                </tr>
              ) : (
                jobs.map((j) => (
                  <tr key={j.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-cyan-400 font-bold">#{j.id}</td>
                    <td className="p-3 font-semibold text-white">{j.type}</td>
                    <td className="p-3">
                      {j.status === 'completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
                          <CheckCircle2 className="w-3 h-3" /> Completed
                        </span>
                      )}
                      {j.status === 'running' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold animate-pulse">
                          <RefreshCw className="w-3 h-3 animate-spin" /> Running
                        </span>
                      )}
                      {j.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-bold">
                          <Clock className="w-3 h-3" /> Pending
                        </span>
                      )}
                      {j.status === 'failed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold">
                          <AlertTriangle className="w-3 h-3" /> Failed
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-slate-300">{j.attempts || 0} / 3</td>
                    <td className="p-3 text-rose-400 font-mono max-w-xs truncate">
                      {j.error_message || '—'}
                    </td>
                    <td className="p-3 text-slate-400">
                      {new Date(j.created_at).toLocaleTimeString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
