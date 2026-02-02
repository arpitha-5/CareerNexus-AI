import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const JobRoleMatchPage = () => {
  const [skills, setSkills] = useState('');
  const [matches, setMatches] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeRoles = () => {
    setLoading(true);
    setTimeout(() => {
      setMatches({
        roles: [
          {
            title: 'Full Stack Developer',
            match: 92,
            salary: '$80k-$120k',
            demand: 'Very High',
            explanation: 'Strong MERN stack skills with React, Node.js, and MongoDB. Excellent portfolio projects.',
            strongSkills: ['React', 'Node.js', 'MongoDB', 'REST APIs'],
            missingSkills: ['TypeScript', 'Docker', 'AWS'],
            companies: ['Google', 'Amazon', 'Startups']
          },
          {
            title: 'Frontend Developer',
            match: 88,
            salary: '$70k-$110k',
            demand: 'Very High',
            explanation: 'Excellent React skills and modern frontend practices. Strong UI/UX sense.',
            strongSkills: ['React', 'JavaScript', 'HTML/CSS', 'Responsive Design'],
            missingSkills: ['Next.js', 'Vue.js', 'Testing'],
            companies: ['Meta', 'Netflix', 'Spotify']
          },
          {
            title: 'Backend Developer',
            match: 75,
            salary: '$75k-$115k',
            demand: 'High',
            explanation: 'Good Node.js knowledge but needs more database and API experience.',
            strongSkills: ['Node.js', 'Express', 'MongoDB'],
            missingSkills: ['PostgreSQL', 'GraphQL', 'Microservices'],
            companies: ['Uber', 'Stripe', 'Twitter']
          },
          {
            title: 'MERN Stack Developer',
            match: 90,
            salary: '$75k-$110k',
            demand: 'High',
            explanation: 'Perfect fit! You have all core MERN stack technologies.',
            strongSkills: ['MongoDB', 'Express', 'React', 'Node.js'],
            missingSkills: ['Redux', 'TypeScript'],
            companies: ['Startups', 'Product Companies']
          },
          {
            title: 'JavaScript Engineer',
            match: 85,
            salary: '$70k-$105k',
            demand: 'High',
            explanation: 'Strong JavaScript fundamentals with modern frameworks.',
            strongSkills: ['JavaScript', 'ES6+', 'React', 'Async Programming'],
            missingSkills: ['Node.js Advanced', 'Performance Optimization'],
            companies: ['Airbnb', 'Dropbox', 'GitHub']
          }
        ]
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl"></div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-rose-400 bg-clip-text text-transparent">
                Job Role Match Engine
              </h1>
              <p className="text-slate-400 mt-1">
                Find your best-fit tech career roles with AI-powered matching
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <label className="block text-sm font-semibold mb-3">
              Enter Your Skills or Paste Resume
            </label>
            <textarea
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, JavaScript, Node.js, MongoDB, HTML, CSS, Express, REST APIs"
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-pink-500 focus:outline-none resize-none"
              rows="5"
            />
            <button
              onClick={analyzeRoles}
              disabled={loading || !skills}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 font-semibold text-white hover:from-pink-500 hover:to-rose-500 disabled:opacity-50 transition"
            >
              {loading ? 'Analyzing Roles...' : 'Find Best Matches'}
            </button>
          </div>
        </motion.div>

        {matches && (
          <div className="mt-8 space-y-4">
            {matches.roles.map((role, idx) => (
              <motion.div
                key={role.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{role.title}</h3>
                    <p className="text-sm text-slate-400">{role.explanation}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-pink-400 mb-1">{role.match}%</div>
                    <div className={`text-xs px-2 py-1 rounded ${
                      role.demand === 'Very High' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                    }`}>
                      {role.demand} Demand
                    </div>
                  </div>
                </div>

                <div className="h-2 bg-slate-800 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-pink-500 to-rose-500"
                    style={{ width: `${role.match}%` }}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-xs font-semibold text-emerald-400 mb-2">✅ Your Strong Skills</div>
                    <div className="flex flex-wrap gap-2">
                      {role.strongSkills.map(skill => (
                        <span key={skill} className="text-xs bg-emerald-500/20 border border-emerald-500/50 px-2 py-1 rounded text-emerald-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-amber-400 mb-2">⚠️ Skills to Learn</div>
                    <div className="flex flex-wrap gap-2">
                      {role.missingSkills.map(skill => (
                        <span key={skill} className="text-xs bg-amber-500/20 border border-amber-500/50 px-2 py-1 rounded text-amber-300">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Salary Range</div>
                    <div className="text-sm font-bold text-emerald-400">{role.salary}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Top Companies</div>
                    <div className="text-xs text-slate-300">{role.companies.join(', ')}</div>
                  </div>
                </div>
              </motion.div>
            ))}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex gap-4"
            >
              <Link
                to="/ai/learning-path"
                className="flex-1 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 px-6 py-3 text-center font-semibold text-white hover:from-pink-500 hover:to-rose-500 transition"
              >
                Generate Learning Path
              </Link>
              <Link
                to="/internships"
                className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold hover:bg-slate-800 transition"
              >
                Find Matching Internships
              </Link>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRoleMatchPage;
