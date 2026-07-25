import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import Dashboard from './pages/Dashboard';
import PlayerProfile from './pages/PlayerProfile';
import PlayerCompare from './pages/PlayerCompare';
import Leaderboards from './pages/Leaderboards';
import AdminJobs from './pages/AdminJobs';

export default function App() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-cyan-500 selection:text-slate-950">
      <Navbar onOpenAuth={() => setIsAuthOpen(true)} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/player/:id" element={<PlayerProfile />} />
          <Route path="/compare" element={<PlayerCompare />} />
          <Route path="/leaderboards" element={<Leaderboards />} />
          <Route path="/admin" element={<AdminJobs />} />
        </Routes>
      </main>

      <Footer />

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
