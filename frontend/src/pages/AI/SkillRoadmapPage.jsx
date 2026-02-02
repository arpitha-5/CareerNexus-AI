import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const SkillRoadmapPage = () => {
  const [skill, setSkill] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateRoadmap = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        skill: 'React.js',
        totalDuration: '4-6 months',
        levels: [
          {
            level: 'Beginner',
            duration: '4-6 weeks',
            color: 'green',
            topics: [
              { name: 'JSX & Components', hours: 8, description: 'Learn JSX syntax and create functional components' },
              { name: 'Props & State', hours: 10, description: 'Understand data flow with props and manage component state' },
              { name: 'Event Handling', hours: 6, description: 'Handle user interactions and form submissions' },
              { name: 'Conditional Rendering', hours: 5, description: 'Display content based on conditions' },
              { name: 'Lists & Keys', hours: 5, description: 'Render dynamic lists efficiently' }
            ],
            projects: ['Todo App', 'Weather Dashboard', 'Simple Blog'],
            resources: ['React Official Docs', 'Scrimba React Course', 'freeCodeCamp']
          },
          {
            level: 'Intermediate',
            duration: '8-10 weeks',
            color: 'amber',
            topics: [
              { name: 'Hooks (useState, useEffect, useRef)', hours: 15, description: 'Master built-in React hooks' },
              { name: 'Custom Hooks', hours: 10, description: 'Create reusable logic with custom hooks' },
              { name: 'Context API', hours: 12, description: 'Manage global state without prop drilling' },
              { name: 'React Router', hours: 10, description: 'Implement client-side routing' },
              { name: 'API Integration', hours: 12, description: 'Fetch and display data from REST APIs' },
              { name: 'Error Boundaries', hours: 6, description: 'Handle component errors gracefully' }
            ],
            projects: ['E-commerce Product Page', 'Social Media Feed', 'Movie Search App'],
            resources: ['Kent C. Dodds Blog', 'React Patterns', 'Josh Comeau']
          },
          {
            level: 'Advanced',
            duration: '10-12 weeks',
            color: 'red',
            topics: [
              { name: 'Performance Optimization (memo, useMemo, useCallback)', hours: 15, description: 'Optimize renders and expensive computations' },
              { name: 'Code Splitting & Lazy Loading', hours: 10, description: 'Improve app load times' },
              { name: 'State Management (Redux/Zustand)', hours: 20, description: 'Manage complex application state' },
              { name: 'Testing (Jest, React Testing Library)', hours: 18, description: 'Write unit and integration tests' },
              { name: 'Server-Side Rendering (Next.js)', hours: 20, description: 'Build SEO-friendly React apps' },
              { name: 'TypeScript with React', hours: 15, description: 'Add type safety to React applications' }
            ],
            projects: ['Real-time Chat App', 'Dashboard with Analytics', 'Full-Stack E-commerce'],
            resources: ['Patterns.dev', 'Testing JavaScript', 'Next.js Docs']
          },
          {
            level: 'Expert',
            duration: '8-10 weeks',
            color: 'purple',
            topics: [
              { name: 'Advanced Patterns (Compound Components, Render Props)', hours: 12, description: 'Master advanced component patterns' },
              { name: 'Micro-frontends', hours: 15, description: 'Build scalable enterprise applications' },
              { name: 'React Internals & Fiber', hours: 20, description: 'Understand how React works under the hood' },
              { name: 'Custom Renderers', hours: 18, description: 'Build React renderers for different platforms' },
              { name: 'Contributing to React', hours: 15, description: 'Contribute to open source React projects' }
            ],
            projects: ['Design System Library', 'React DevTools Extension', 'Custom React Renderer'],
            resources: ['React RFC Repository', 'Dan Abramov Blog', 'React Conf Talks']
          }
        ],
        milestones: [
          { week: 6, achievement: 'Build 3 functional React apps', badge: '🎯' },
          { week: 16, achievement: 'Master hooks and API integration', badge: '🔥' },
          { week: 28, achievement: 'Deploy production-ready app with tests', badge: '🚀' },
          { week: 36, achievement: 'Contribute to open source React project', badge: '⭐' }
        ],
        certifications: ['Meta React Certification', 'Epic React by Kent C. Dodds'],
        nextSkills: ['Next.js', 'React Native', 'GraphQL']
      });
      setLoading(false);
    }, 1500);
  };

  const getLevelColor = (color) => {
    const colors = {
      green: 'from-green-400 to-emerald-400',
      amber: 'from-amber-400 to-orange-400',
      red: 'from-red-400 to-rose-400',
      purple: 'from-purple-400 to-fuchsia-400'
    };
    return colors[color] || 'from-blue-400 to-cyan-400';
  };

  const getLevelBgColor = (color) => {
    const colors = {
      green: 'from-green-900/30 to-emerald-900/30',
      amber: 'from-amber-900/30 to-orange-900/30',
      red: 'from-red-900/30 to-rose-900/30',
      purple: 'from-purple-900/30 to-fuchsia-900/30'
    };
    return colors[color] || 'from-blue-900/30 to-cyan-900/30';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">🛣️</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-lime-400 to-green-400 bg-clip-text text-transparent">
                Skill Roadmap Generator
              </h1>
              <p className="text-slate-400 mt-1">Complete learning path from Beginner → Expert with timeline & projects</p>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <label className="block text-sm font-semibold mb-3">Which skill do you want to master?</label>
            <input
              type="text"
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              placeholder="e.g., React, Node.js, Python, Machine Learning, AWS..."
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-green-500 focus:outline-none"
            />
            <button
              onClick={generateRoadmap}
              disabled={loading || !skill}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-lime-600 to-green-600 px-6 py-3 font-semibold text-white hover:from-lime-500 hover:to-green-500 disabled:opacity-50 transition"
            >
              {loading ? 'Generating Roadmap...' : '🛣️ Generate Complete Roadmap'}
            </button>
          </div>
        </motion.div>

        {/* Results */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 space-y-6"
          >
            {/* Overview */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h2 className="text-3xl font-bold mb-4">{result.skill} Mastery Roadmap</h2>
              <div className="text-slate-300 mb-4">
                Complete journey from absolute beginner to expert level
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="bg-green-500/20 text-green-300 px-3 py-1 rounded-lg">
                  ⏱️ Total Duration: {result.totalDuration}
                </span>
                <span className="text-slate-400">{result.levels.length} Levels</span>
              </div>
            </div>

            {/* Levels */}
            {result.levels.map((level, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl border border-slate-800 bg-gradient-to-br ${getLevelBgColor(level.color)} p-6`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${getLevelColor(level.color)} bg-clip-text text-transparent`}>
                    {level.level} Level
                  </h3>
                  <span className="text-sm text-slate-400">⏱️ {level.duration}</span>
                </div>

                {/* Topics */}
                <div className="mb-6">
                  <h4 className="font-semibold mb-3">📚 Topics to Learn</h4>
                  <div className="space-y-2">
                    {level.topics.map((topic, tidx) => (
                      <div key={tidx} className="rounded-lg bg-slate-900/50 p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-slate-100">{topic.name}</div>
                          <span className="text-xs bg-slate-800/50 text-slate-300 px-2 py-1 rounded">
                            {topic.hours}h
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">{topic.description}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 text-sm text-slate-400">
                    Total Learning Hours: {level.topics.reduce((sum, t) => sum + t.hours, 0)} hours
                  </div>
                </div>

                {/* Projects */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-3">🚀 Practice Projects</h4>
                  <div className="flex flex-wrap gap-2">
                    {level.projects.map((project, pidx) => (
                      <span key={pidx} className="bg-slate-800/50 text-slate-300 px-3 py-1.5 rounded-lg text-sm">
                        {project}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Resources */}
                <div>
                  <h4 className="font-semibold mb-2">📖 Recommended Resources</h4>
                  <div className="flex flex-wrap gap-2">
                    {level.resources.map((resource, ridx) => (
                      <span key={ridx} className={`bg-gradient-to-r ${getLevelColor(level.color)} bg-opacity-20 text-slate-200 px-3 py-1 rounded text-sm`}>
                        {resource}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Milestones */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">🎯 Key Milestones</h3>
              <div className="space-y-3">
                {result.milestones.map((milestone, idx) => (
                  <div key={idx} className="flex items-center gap-4 rounded-lg bg-slate-800/50 p-4">
                    <div className="text-3xl">{milestone.badge}</div>
                    <div className="flex-1">
                      <div className="text-slate-400 text-xs">Week {milestone.week}</div>
                      <div className="font-semibold">{milestone.achievement}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications & Next Steps */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-xl font-bold mb-4">🏅 Recommended Certifications</h3>
                <div className="space-y-2">
                  {result.certifications.map((cert, idx) => (
                    <div key={idx} className="bg-lime-500/20 text-lime-300 px-4 py-2 rounded-lg text-sm">
                      {cert}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-xl font-bold mb-4">➡️ Next Skills to Learn</h3>
                <div className="space-y-2">
                  {result.nextSkills.map((nextSkill, idx) => (
                    <div key={idx} className="bg-slate-800/50 text-slate-300 px-4 py-2 rounded-lg text-sm">
                      {nextSkill}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                to="/ai/weekly-goals"
                className="flex-1 rounded-lg bg-gradient-to-r from-lime-600 to-green-600 px-6 py-3 text-center font-semibold text-white hover:from-lime-500 hover:to-green-500 transition"
              >
                📅 Break Into Weekly Goals
              </Link>
              <Link
                to="/dashboard"
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 hover:bg-slate-800 transition"
              >
                ← Back to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SkillRoadmapPage;
