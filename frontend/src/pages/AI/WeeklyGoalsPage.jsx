import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const WeeklyGoalsPage = () => {
  const [learningPath, setLearningPath] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('2');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateGoals = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        weekNumber: 12,
        theme: 'React Advanced Patterns & State Management',
        totalHours: parseInt(hoursPerDay) * 7,
        dailyGoals: [
          {
            day: 'Monday',
            focus: 'Component Composition Patterns',
            tasks: [
              { title: 'Study Compound Components pattern', duration: '45 min', type: 'theory' },
              { title: 'Build custom Select dropdown using pattern', duration: '1 hr', type: 'practice' },
              { title: 'Watch Kent C. Dodds Advanced React Patterns', duration: '30 min', type: 'video' }
            ],
            resources: ['React Docs', 'Patterns.dev']
          },
          {
            day: 'Tuesday',
            focus: 'Render Props & HOCs',
            tasks: [
              { title: 'Learn Render Props pattern', duration: '40 min', type: 'theory' },
              { title: 'Refactor component to use Render Props', duration: '1 hr 20 min', type: 'practice' },
              { title: 'Compare HOC vs Render Props', duration: '20 min', type: 'theory' }
            ],
            resources: ['React Official Blog', 'FreeCodeCamp']
          },
          {
            day: 'Wednesday',
            focus: 'Context API Deep Dive',
            tasks: [
              { title: 'Understanding Context performance', duration: '30 min', type: 'theory' },
              { title: 'Build Theme switcher with Context', duration: '1 hr', type: 'practice' },
              { title: 'Implement multi-level Context providers', duration: '50 min', type: 'practice' }
            ],
            resources: ['Kent C. Dodds Blog', 'Web Dev Simplified']
          },
          {
            day: 'Thursday',
            focus: 'Redux Fundamentals',
            tasks: [
              { title: 'Redux core concepts (Store, Actions, Reducers)', duration: '1 hr', type: 'theory' },
              { title: 'Setup Redux in existing project', duration: '45 min', type: 'practice' },
              { title: 'Redux DevTools exploration', duration: '35 min', type: 'practice' }
            ],
            resources: ['Redux Official Tutorial', 'Dave Ceddia']
          },
          {
            day: 'Friday',
            focus: 'Redux Toolkit',
            tasks: [
              { title: 'Learn createSlice and configureStore', duration: '50 min', type: 'theory' },
              { title: 'Migrate vanilla Redux to RTK', duration: '1 hr 10 min', type: 'practice' },
              { title: 'Implement async actions with createAsyncThunk', duration: '30 min', type: 'practice' }
            ],
            resources: ['Redux Toolkit Docs', 'Academind']
          },
          {
            day: 'Saturday',
            focus: 'Mini-Project Day 1',
            tasks: [
              { title: 'Project planning & architecture', duration: '30 min', type: 'planning' },
              { title: 'Setup project with Redux Toolkit', duration: '30 min', type: 'practice' },
              { title: 'Build task management features', duration: '2 hrs', type: 'project' }
            ],
            resources: ['Your creativity!']
          },
          {
            day: 'Sunday',
            focus: 'Mini-Project Day 2 & Review',
            tasks: [
              { title: 'Add filtering & sorting features', duration: '1 hr 30 min', type: 'project' },
              { title: 'Implement local storage persistence', duration: '45 min', type: 'project' },
              { title: 'Code review & refactoring', duration: '45 min', type: 'review' }
            ],
            resources: ['Your creativity!']
          }
        ],
        miniProject: {
          title: 'Redux Task Manager with Categories',
          description: 'Build a task management app using Redux Toolkit with features like categories, filters, sorting, and local storage',
          features: [
            'Add/Edit/Delete tasks',
            'Category management',
            'Filter by status/category',
            'Sort by priority/date',
            'Persist data in localStorage'
          ],
          techStack: ['React', 'Redux Toolkit', 'Tailwind CSS'],
          estimatedTime: '4-5 hours'
        },
        weeklyCheckpoints: [
          { checkpoint: 'Understand 3 React patterns', completed: false },
          { checkpoint: 'Setup Redux in a project', completed: false },
          { checkpoint: 'Complete mini-project', completed: false },
          { checkpoint: 'Push code to GitHub', completed: false }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const getTaskIcon = (type) => {
    const icons = {
      theory: '📖',
      practice: '💻',
      video: '🎥',
      planning: '📋',
      project: '🚀',
      review: '🔍'
    };
    return icons[type] || '📌';
  };

  return (
    <div className="min-h-screen theme-bg">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl"></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Weekly Goals Generator
              </h1>
              <p className="theme-text-muted mt-1">Break down your learning path into actionable daily tasks & mini-projects</p>
            </div>
          </div>
        </motion.div>

        {/* Input Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="theme-card">
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-3">What are you learning this week?</label>
              <input
                type="text"
                value={learningPath}
                onChange={(e) => setLearningPath(e.target.value)}
                placeholder="e.g., React Advanced Patterns, Node.js APIs, Python Data Science..."
                className="theme-input"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Hours per day</label>
              <select
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(e.target.value)}
                className="theme-input"
              >
                <option value="1">1 hour</option>
                <option value="2">2 hours</option>
                <option value="3">3 hours</option>
                <option value="4">4 hours</option>
                <option value="5">5+ hours</option>
              </select>
            </div>
            <button
              onClick={generateGoals}
              disabled={loading || !learningPath}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 font-semibold text-white hover:from-amber-500 hover:to-orange-500 disabled:opacity-50 transition"
            >
              {loading ? 'Generating Goals...' : '📅 Generate Weekly Plan'}
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
            <div className="theme-card">
              <h2 className="text-2xl font-bold mb-4">Week {result.weekNumber}: {result.theme}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 p-4">
                  <div className="text-slate-400 text-sm">Total Learning Time</div>
                  <div className="text-2xl font-bold text-amber-400">{result.totalHours} hours</div>
                </div>
                <div className="rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 p-4">
                  <div className="text-slate-400 text-sm">Mini-Project</div>
                  <div className="text-lg font-semibold text-purple-400">{result.miniProject.title}</div>
                </div>
              </div>
            </div>

            {/* Daily Goals */}
            {result.dailyGoals.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-amber-400">{day.day}</h3>
                  <span className="text-sm text-slate-400">{day.focus}</span>
                </div>
                <div className="space-y-2">
                  {day.tasks.map((task, tidx) => (
                    <div key={tidx} className="flex items-start gap-3 rounded-lg bg-slate-800/50 p-3">
                      <div className="text-xl mt-0.5">{getTaskIcon(task.type)}</div>
                      <div className="flex-1">
                        <div className="font-medium">{task.title}</div>
                        <div className="text-xs text-slate-400 mt-1">⏱️ {task.duration}</div>
                      </div>
                      <span className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded capitalize">
                        {task.type}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {day.resources.map((resource, ridx) => (
                    <span key={ridx} className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">
                      📚 {resource}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}

            {/* Mini Project Details */}
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-6">
              <h3 className="text-2xl font-bold mb-4">🚀 Weekend Mini-Project</h3>
              <div className="mb-4">
                <h4 className="text-xl font-semibold text-purple-400 mb-2">{result.miniProject.title}</h4>
                <p className="text-slate-300">{result.miniProject.description}</p>
              </div>
              <div className="mb-4">
                <h5 className="font-semibold mb-2">Features to Implement:</h5>
                <ul className="space-y-1">
                  {result.miniProject.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-slate-300">
                      <span className="text-green-400">✓</span> {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm font-semibold text-slate-400">Tech Stack:</span>
                {result.miniProject.techStack.map((tech, idx) => (
                  <span key={idx} className="bg-slate-700/50 text-purple-300 px-3 py-1 rounded-lg text-sm">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-sm text-slate-400">
                ⏱️ Estimated Time: {result.miniProject.estimatedTime}
              </div>
            </div>

            {/* Weekly Checkpoints */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">✅ Weekly Checkpoints</h3>
              <div className="space-y-2">
                {result.weeklyCheckpoints.map((checkpoint, idx) => (
                  <div key={idx} className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-3">
                    <input
                      type="checkbox"
                      checked={checkpoint.completed}
                      className="w-5 h-5 rounded border-slate-600"
                      readOnly
                    />
                    <span className="text-slate-300">{checkpoint.checkpoint}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                to="/ai/project-generator"
                className="flex-1 rounded-lg bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-center font-semibold text-white hover:from-amber-500 hover:to-orange-500 transition"
              >
                🚀 Generate Project Ideas
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

export default WeeklyGoalsPage;
