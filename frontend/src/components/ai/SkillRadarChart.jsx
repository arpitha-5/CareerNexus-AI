// SkillRadarChart.jsx
import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const SkillRadarChart = ({ skills = [] }) => {
  const data = skills.map((s) => ({ skill: s.name, level: s.level }));
  if (!data.length) return <p className="text-[11px] text-slate-400">No skills detected yet.</p>;

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart data={data} outerRadius={90}>
        <PolarGrid stroke="#1e293b" />
        <PolarAngleAxis dataKey="skill" tick={{ fill: '#e5e7eb', fontSize: 10 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
        <Radar
          dataKey="level"
          stroke="#6366f1"
          fill="#6366f1"
          fillOpacity={0.5}
          name="Skill Level"
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};

export default SkillRadarChart;