import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Trophy, GitCompare, Cpu, Shield, User, LogOut, Activity } from 'lucide-react';
import PlayerAvatar from './PlayerAvatar';
import { searchPlayers } from '../api';

// Navbar component with real-time search & autocomplete
export default function Navbar({ user, onLogout, onOpenAuth }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await searchPlayers(searchTerm);
        const arr = Array.isArray(res) ? res : (res?.players || []);
        setSuggestions(arr.slice(0, 5));
        setIsOpen(true);
      } catch (err) {
        console.error('Navbar search error:', err);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectPlayer = (id) => {
    setIsOpen(false);
    setSearchTerm('');
    navigate(`/player/${id}`);
  };

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('cricketiq_token');
      localStorage.removeItem('cricketiq_user');
      window.location.reload();
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-teal-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-100 to-cyan-300">
                Cricket<span className="text-cyan-400">IQ</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-md uppercase tracking-wider">
                AI Analytics
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">Historical Performance Engine</p>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div className="relative flex-1 max-w-md mx-2" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search cricketers (e.g., Sachin, Brett Lee, Ponting)..."
              className="w-full bg-slate-900/90 border border-slate-700/70 rounded-xl pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
            />
          </div>

          {/* Autocomplete Dropdown */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full mt-2 w-full glass-panel bg-slate-900/95 rounded-xl border border-slate-700/80 shadow-2xl overflow-hidden z-50">
              <div className="p-2 text-xs font-semibold text-slate-400 border-b border-slate-800">
                Matching Players ({suggestions.length})
              </div>
              <div className="max-h-72 overflow-y-auto">
                {suggestions.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelectPlayer(p.id)}
                    className="w-full text-left px-4 py-2.5 flex items-center justify-between hover:bg-slate-800/80 transition-colors border-b border-slate-800/50 last:border-none"
                  >
                    <div className="flex items-center gap-3">
                      <PlayerAvatar name={p.name} country={p.country} photo_url={p.photo_url} size="sm" />
                      <div>
                        <div className="font-semibold text-sm text-slate-100">{p.name}</div>
                        <div className="text-xs text-slate-400">{p.country} • {p.role}</div>
                      </div>
                    </div>
                    <span className="text-xs text-cyan-400 font-medium">View Profile →</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Nav Links */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Link
            to="/leaderboards"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="hidden md:inline">Leaderboards</span>
          </Link>

          <Link
            to="/compare"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">Compare</span>
          </Link>

          {/* Jobs & Queue Link (Admin Only) */}
          {user?.role === 'admin' ? (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors shadow-sm"
            >
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Jobs & Queue</span>
            </Link>
          ) : (
            <Link
              to="/admin"
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
              title="Admin Authentication Required"
            >
              <Cpu className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Jobs Queue</span>
            </Link>
          )}

          {/* User Auth Info */}
          {user ? (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 rounded-xl border border-slate-800 text-xs">
                <span className="text-slate-200 font-semibold hidden sm:inline">{user.email.split('@')[0]}</span>
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-extrabold rounded uppercase tracking-wider ${
                    user.role === 'admin'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                title="Logout"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-900 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-90 transition-opacity shadow-md shadow-cyan-500/20"
            >
              <User className="w-3.5 h-3.5" />
              Sign In
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
