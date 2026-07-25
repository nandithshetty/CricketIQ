import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  Legend
} from 'recharts';

export default function FormatRadarChart({ careerStats }) {
  if (!careerStats || careerStats.length === 0) return null;

  const overall = careerStats.filter((s) => s.season === null);
  const test = overall.find((s) => s.format === 'Test') || {};
  const odi = overall.find((s) => s.format === 'ODI') || {};
  const t20 = overall.find((s) => s.format === 'T20') || {};

  // Normalize stats onto 0-100 scale for radar visualization
  const data = [
    {
      subject: 'Batting Avg',
      Test: Math.min(100, (test.average || 0) * 1.5),
      ODI: Math.min(100, (odi.average || 0) * 1.8),
      T20: Math.min(100, (t20.average || 0) * 2.2)
    },
    {
      subject: 'Strike Rate',
      Test: Math.min(100, (test.strike_rate || 0) * 1.2),
      ODI: Math.min(100, (odi.strike_rate || 0) * 0.9),
      T20: Math.min(100, (t20.strike_rate || 0) * 0.7)
    },
    {
      subject: 'Centuries (100s)',
      Test: Math.min(100, (test.hundreds || 0) * 10),
      ODI: Math.min(100, (odi.hundreds || 0) * 12),
      T20: Math.min(100, (t20.hundreds || 0) * 25)
    },
    {
      subject: 'Half-Centuries',
      Test: Math.min(100, (test.fifties || 0) * 5),
      ODI: Math.min(100, (odi.fifties || 0) * 6),
      T20: Math.min(100, (t20.fifties || 0) * 10)
    },
    {
      subject: 'Wickets Index',
      Test: Math.min(100, (test.wickets || 0) * 4),
      ODI: Math.min(100, (odi.wickets || 0) * 5),
      T20: Math.min(100, (t20.wickets || 0) * 8)
    }
  ];

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={11} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={10} />
          <Radar name="Test Cricket" dataKey="Test" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.3} />
          <Radar name="ODI Cricket" dataKey="ODI" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.3} />
          <Radar name="T20 Cricket" dataKey="T20" stroke="#10b981" fill="#10b981" fillOpacity={0.3} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0f172a',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px'
            }}
          />
          <Legend wrapperStyle={{ fontSize: '11px' }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
