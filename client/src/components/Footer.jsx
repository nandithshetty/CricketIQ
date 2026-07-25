import React from 'react';
import { Activity, Database, Cpu, Sparkles, Github } from 'lucide-react';

// Footer component with platform metadata
export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 py-12 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <div className="font-bold text-white tracking-tight text-base">
              Cricket<span className="text-cyan-400">IQ</span>
            </div>
            <p className="text-xs text-slate-400">Real Historical Ball-by-Ball Cricket Analytics & AI Engine</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 font-medium">
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
            <Database className="w-3.5 h-3.5 text-cyan-400" /> Cricsheet Data
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> MySQL / In-Memory Cache
          </span>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Gemini Constrained AI
          </span>
        </div>

        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} CricketIQ Platform. All stats pre-computed from historical datasets.
        </p>
      </div>
    </footer>
  );
}
