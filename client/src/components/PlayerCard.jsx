import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import PlayerAvatar from './PlayerAvatar';

export default function PlayerCard({ player }) {
  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between group relative overflow-hidden">
      {/* Background Subtle Gradient */}
      <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <PlayerAvatar name={player.name} country={player.country} photo_url={player.photo_url} size="lg" />
            <div>
              <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                {player.name}
              </h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
                  {player.country}
                </span>
                <span className="text-xs text-slate-400 line-clamp-1">{player.role}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Pill */}
        <div className="grid grid-cols-2 gap-2 my-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
          <div>
            <div className="text-slate-400">Batting Style</div>
            <div className="font-semibold text-slate-200 truncate">{player.batting_style || 'N/A'}</div>
          </div>
          <div>
            <div className="text-slate-400">Bowling Style</div>
            <div className="font-semibold text-slate-200 truncate">{player.bowling_style || 'N/A'}</div>
          </div>
        </div>
      </div>

      <Link
        to={`/player/${player.id}`}
        className="w-full mt-2 py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 border border-slate-700/60 hover:border-cyan-500/40 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
      >
        <span>View Analytics Profile</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
}
