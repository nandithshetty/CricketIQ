import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

function getFormatStats(p, selectedFormat) {
  if (!p.formats) return null;

  if (selectedFormat === 'ALL') {
    const allFmts = Object.values(p.formats).filter(Boolean);
    if (allFmts.length === 0) return null;
    const matches = allFmts.reduce((a, x) => a + (x.matches || 0), 0);
    const runs = allFmts.reduce((a, x) => a + (x.runs || 0), 0);
    const wickets = allFmts.reduce((a, x) => a + (x.wickets || 0), 0);
    const hundreds = allFmts.reduce((a, x) => a + (x.hundreds || 0), 0);
    const average = matches > 0 ? Number((runs / (matches * 0.85)).toFixed(2)) : 0;
    const strikeRate = Number(
      (allFmts.reduce((a, x) => a + (x.strike_rate || 0), 0) / allFmts.length).toFixed(2)
    );
    return { matches, runs, wickets, hundreds, average, strike_rate: strikeRate };
  }

  return p.formats[selectedFormat] || null;
}

export default function ComparisonBarChart({ players, selectedFormat = 'ODI' }) {
  if (!players || players.length === 0) return null;

  const data = players.map((p) => {
    const f = getFormatStats(p, selectedFormat);
    return {
      name: p.name.split(' ').slice(-1)[0], // Use last name for brevity on chart
      Runs: f ? f.runs : 0,
      Average: f ? f.average : 0,
      StrikeRate: f ? f.strike_rate : 0,
      Wickets: f ? f.wickets : 0,
    };
  });

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Bar dataKey="Runs" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Average" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="StrikeRate" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Wickets" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
