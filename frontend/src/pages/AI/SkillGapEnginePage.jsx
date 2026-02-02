import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const SkillGapEnginePage = () => {
  const [skills, setSkills] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeSkills = () => {
    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      setAnalysis({
        detectedSkills: ['React', 'JavaScript', 'Node.js', 'MongoDB', 'HTML/CSS'],
        missingSkills: ['TypeScript', 'Docker', 'AWS', 'GraphQL', 'Redis'],
        roleMatches: [
          { role: 'Full Stack Developer', match: 85, demand: 'High' },
          { role: 'Frontend Developer', match: 92, demand: 'Very High' },
          { role: 'MERN Stack Developer', match: 88, demand: 'High' },
          { role: 'Backend Developer', match: 72, demand: 'High' },
          { role: 'DevOps Engineer', match: 45, demand: 'Medium' },
        ],
        priorities: [
          'Learn TypeScript for better code quality',
          'Master Docker for containerization',
          'Get AWS certification for cloud skills',
          'Build GraphQL APIs for modern backends',
        ],
        recommendations: [
          { role: 'Full Stack Developer', reason: 'Strong MERN stack foundation' },
          { role: 'Frontend Developer', reason: 'Excellent React skills' },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen theme-bg">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl"></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                Skill Gap Engine
              </h1>
              <p className="theme-text-muted mt-1">
                Analyze your skills and find gaps for 30+ tech job roles
              </p>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="theme-card">
            <label className="block text-sm font-semibold mb-3">
              Enter Your Skills (comma separated)
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, JavaScript, Node.js, MongoDB, HTML, CSS"
              className="theme-input resize-none"
              rows="4"
            />
            <button
              onClick={analyzeSkills}
              disabled={loading || !skills}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 font-semibold text-white hover:from-violet-500 hover:to-purple-500 disabled:opacity-50 transition"
            >
              {loading ? 'Analyzing...' : 'Analyze Skill Gaps'}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {analysis && (
          <div className="space-y-6">
            {/* Detected Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="theme-card"
            >
              <h2 className="text-xl font-bold mb-4 text-emerald-400">✅ Detected Skills</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.detectedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-emerald-500/20 border border-emerald-500/50 px-4 py-2 text-sm text-emerald-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Missing Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="theme-card"
            >
              <h2 className="text-xl font-bold mb-4 text-red-400">⚠️ Missing Skills</h2>
              <div className="flex flex-wrap gap-2">
                {analysis.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-red-500/20 border border-red-500/50 px-4 py-2 text-sm text-red-300"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* Role Matches */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="theme-card"
            >
              <h2 className="text-xl font-bold mb-4">🎯 Role Match Analysis (30+ Roles)</h2>
              <div className="space-y-3">
                {analysis.roleMatches.map((role) => (
                  <div key={role.role} className="rounded-lg p-4 theme-bg-tertiary">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold">{role.role}</div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2 py-1 rounded ${
                          role.demand === 'Very High' ? 'bg-emerald-500/20 text-emerald-400' :
                          role.demand === 'High' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {role.demand} Demand
                        </span>
                        <span className="text-2xl font-bold text-violet-400">{role.match}%</span>
                      </div>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden theme-bg-secondary">
                      <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500"
                        style={{ width: `${role.match}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Priority Areas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="theme-card"
            >
              <h2 className="text-xl font-bold mb-4 text-amber-400">⭐ Priority Focus Areas</h2>
              <ul className="space-y-2">
                {analysis.priorities.map((priority, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-amber-400 mt-1">•</span>
                    <span>{priority}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="theme-card"
            >
              <h2 className="text-xl font-bold mb-4 text-indigo-400">🚀 Top Recommended Roles</h2>
              <div className="space-y-4">
                {analysis.recommendations.map((rec) => (
                  <div key={rec.role} className="rounded-lg bg-indigo-500/10 border border-indigo-500/30 p-4">
                    <div className="font-bold text-indigo-300 mb-1">{rec.role}</div>
                    <div className="text-sm text-slate-400">{rec.reason}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

        {/* CTA */}
        {analysis && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex gap-4"
          >
            <Link
              to="/ai/learning-path"
              className="flex-1 rounded-lg bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-3 text-center font-semibold text-white hover:from-violet-500 hover:to-purple-500 transition"
            >
              Generate Learning Path
            </Link>
            <Link
              to="/courses"
              className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold hover:bg-slate-800 transition"
            >
              Browse Courses
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkillGapEnginePage;
