// SkillGapReportPage.jsx
import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { generateSkillGaps } from '../../api/aiApi.js';
import SkillRadarChart from '../../components/ai/SkillRadarChart.jsx';

const SkillGapReportPage = () => {
  const [targetRole, setTargetRole] = useState('Frontend Developer');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    setLoading(true);
    try {
      const { data } = await generateSkillGaps(targetRole);
      setProfile(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate skill gaps');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 pt-24 pb-10 space-y-5">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <div>
            <h1 className="text-xl font-bold">Skill Gap Analysis</h1>
            <p className="text-xs text-slate-400">
              AI compares your current skills vs a target role and highlights missing/weak skills.
            </p>
          </div>
          <div className="flex gap-2 text-xs">
            <input
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="rounded-md bg-slate-900 px-3 py-2 text-slate-100 outline-none ring-1 ring-slate-700 focus:ring-indigo-500"
            />
            <button
              onClick={generate}
              disabled={loading}
              className="rounded-md bg-indigo-500 px-4 py-2 font-semibold text-white hover:bg-indigo-400"
            >
              {loading ? 'Analyzing...' : 'Generate'}
            </button>
          </div>
        </div>

        {profile && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
              <h2 className="mb-2 text-xs font-semibold text-slate-300">Skill Radar</h2>
              <SkillRadarChart skills={profile.currentSkills} />
            </div>
            <div className="space-y-3 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 text-xs">
              <div>
                <h3 className="mb-1 font-semibold text-slate-200">Missing Skills</h3>
                <div className="flex flex-wrap gap-1">
                  {profile.missingSkills.map((s) => (
                    <span
                      key={s}
                      className="rounded-full bg-red-500/20 px-2 py-1 text-[11px] text-red-200"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-200">Weak Areas</h3>
                <ul className="space-y-1 text-slate-300">
                  {profile.weakAreas.map((w) => (
                    <li key={w.name}>
                      {w.name} – <span className="text-amber-300">{w.level}/100</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="mb-1 font-semibold text-slate-200">Summary</h3>
                <p className="text-slate-400">{profile.comparisonSummary}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapReportPage;