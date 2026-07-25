import React from 'react';

export default function StatBadge({ label, value, subtext, icon: Icon, color = 'cyan' }) {
  const colorMap = {
    cyan: 'border-cyan-500/20 bg-cyan-500/5 text-cyan-400',
    emerald: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400',
    amber: 'border-amber-500/20 bg-amber-500/5 text-amber-400',
    purple: 'border-purple-500/20 bg-purple-500/5 text-purple-400'
  };

  return (
    <div className={`p-4 rounded-2xl border ${colorMap[color] || colorMap.cyan} glass-panel relative overflow-hidden`}>
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{label}</span>
        {Icon && <Icon className="w-4 h-4 opacity-80" />}
      </div>
      <div className="text-2xl font-extrabold text-white tracking-tight my-0.5">
        {value !== undefined && value !== null ? value : '—'}
      </div>
      {subtext && <div className="text-[11px] font-medium text-slate-400 mt-1">{subtext}</div>}
    </div>
  );
}
