import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';

export default function RunsByYearChart({ timeline }) {
  if (!timeline || timeline.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
        No yearly timeline data available for this player.
      </div>
    );
  }

  // Aggregate by year if multiple formats exist per year
  const yearMap = {};
  timeline.forEach((item) => {
    const yr = item.year;
    if (!yearMap[yr]) {
      yearMap[yr] = { year: yr, runs: 0, wickets: 0, matches: 0 };
    }
    yearMap[yr].runs += Number(item.runs || 0);
    yearMap[yr].wickets += Number(item.wickets || 0);
    yearMap[yr].matches += Number(item.matches || 0);
  });

  const chartData = Object.values(yearMap).sort((a, b) => a.year - b.year);

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="runsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="year" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis yAxisId="left" stroke="#64748b" fontSize={12} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="#10b981" fontSize={12} tickLine={false} />
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
          <Bar yAxisId="left" dataKey="runs" name="Total Runs" fill="url(#runsGrad)" radius={[6, 6, 0, 0]} />
          <Line yAxisId="right" type="monotone" dataKey="wickets" name="Wickets Taken" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
