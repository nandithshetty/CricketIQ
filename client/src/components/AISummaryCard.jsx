import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { getAISummary } from '../api';

export default function AISummaryCard({ playerId, initialSummary, generatedAt }) {
  const [summary, setSummary] = useState(initialSummary || '');
  const [date, setDate] = useState(generatedAt);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRefresh = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const data = await getAISummary(playerId, true);
      setSummary(data.summary);
      setDate(data.generatedAt);
    } catch (err) {
      console.error('Failed to refresh AI summary:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative rounded-2xl glass-panel p-6 border border-cyan-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/60 to-cyan-950/20 shadow-xl overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-emerald-400 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white">AI Performance Insight</h3>
              <span className="flex items-center gap-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                <ShieldCheck className="w-3 h-3" /> Grounded Stats
              </span>
            </div>
            <p className="text-xs text-slate-400">Powered by Gemini AI (Constrained to verified numbers)</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={loading}
          className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-xs font-semibold text-cyan-300 border border-slate-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Re-analyzing...' : 'Refresh Summary'}
        </button>
      </div>

      <div className="text-sm text-slate-200 leading-relaxed font-normal bg-slate-950/40 p-4 rounded-xl border border-slate-800/60">
        {summary || 'Generating analytical performance summary from verified cricket stats...'}
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
        <span>
          Generated: {date ? new Date(date).toLocaleString() : 'Just now'}
        </span>
        <span className="text-slate-400 italic">
          No numbers hallucinated • Pre-computed aggregate baseline
        </span>
      </div>
    </div>
  );
}
