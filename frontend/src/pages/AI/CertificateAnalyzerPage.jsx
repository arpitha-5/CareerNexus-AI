import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const CertificateAnalyzerPage = () => {
  const [certName, setCertName] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeCert = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        certificationName: 'AWS Certified Solutions Architect - Associate',
        provider: 'Amazon Web Services',
        skillsLearned: [
          { skill: 'Cloud Architecture', category: 'Core', proficiency: 'advanced' },
          { skill: 'AWS EC2', category: 'Compute', proficiency: 'advanced' },
          { skill: 'AWS S3', category: 'Storage', proficiency: 'advanced' },
          { skill: 'VPC & Networking', category: 'Network', proficiency: 'intermediate' },
          { skill: 'IAM & Security', category: 'Security', proficiency: 'intermediate' },
          { skill: 'Load Balancing', category: 'Network', proficiency: 'intermediate' },
          { skill: 'Auto Scaling', category: 'Compute', proficiency: 'intermediate' },
          { skill: 'RDS & Databases', category: 'Database', proficiency: 'intermediate' }
        ],
        difficulty: 'Intermediate to Advanced',
        preparationTime: '2-3 months',
        passingScore: '720/1000',
        careerImpact: {
          salaryIncrease: '+15-25%',
          jobOpportunities: 'High - Cloud roles in demand',
          rolesUnlocked: ['Cloud Engineer', 'Solutions Architect', 'DevOps Engineer']
        },
        prerequisites: ['Basic AWS knowledge', 'Networking fundamentals', 'Linux basics'],
        examFormat: '65 questions, 130 minutes, Multiple choice & response',
        cost: '$150 USD',
        validity: '3 years',
        recommendations: [
          'Take AWS official training courses',
          'Practice with AWS Free Tier',
          'Build 2-3 projects deploying to AWS',
          'Use practice exams to test knowledge'
        ]
      });
      setLoading(false);
    }, 1500);
  };

  const getProficiencyColor = (prof) => {
    if (prof === 'advanced') return 'bg-purple-500/20 text-purple-300';
    if (prof === 'intermediate') return 'bg-blue-500/20 text-blue-300';
    return 'bg-green-500/20 text-green-300';
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-10">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="text-5xl">🏆</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent">
                Certificate Analyzer
              </h1>
              <p className="text-slate-400 mt-1">Extract skills, difficulty, and career impact from certifications</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <label className="block text-sm font-semibold mb-3">Certificate Name</label>
            <input
              type="text"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              placeholder="e.g., AWS Solutions Architect, Google Cloud Professional, Meta Frontend Developer..."
              className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-cyan-500 focus:outline-none"
            />
            <button
              onClick={analyzeCert}
              disabled={loading || !certName}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 font-semibold text-white hover:from-teal-500 hover:to-cyan-500 disabled:opacity-50 transition"
            >
              {loading ? 'Analyzing...' : '🏆 Analyze Certificate'}
            </button>
          </div>
        </motion.div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 space-y-6">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 p-6">
              <h2 className="text-2xl font-bold mb-2">{result.certificationName}</h2>
              <div className="text-slate-400 mb-4">by {result.provider}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs text-slate-400">Difficulty</div>
                  <div className="font-semibold text-cyan-400">{result.difficulty}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Prep Time</div>
                  <div className="font-semibold text-cyan-400">{result.preparationTime}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Cost</div>
                  <div className="font-semibold text-cyan-400">{result.cost}</div>
                </div>
                <div>
                  <div className="text-xs text-slate-400">Validity</div>
                  <div className="font-semibold text-cyan-400">{result.validity}</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">📚 Skills You'll Learn</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {result.skillsLearned.map((item, idx) => (
                  <div key={idx} className="rounded-lg bg-slate-800/50 p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{item.skill}</span>
                      <span className={`text-xs px-2 py-1 rounded ${getProficiencyColor(item.proficiency)}`}>
                        {item.proficiency}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{item.category}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">💼 Career Impact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">💰</span>
                  <div>
                    <div className="font-semibold">Salary Increase</div>
                    <div className="text-sm text-slate-400">{result.careerImpact.salaryIncrease}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-cyan-400 text-2xl">📈</span>
                  <div>
                    <div className="font-semibold">Job Opportunities</div>
                    <div className="text-sm text-slate-400">{result.careerImpact.jobOpportunities}</div>
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-2">🚀 Roles Unlocked</div>
                  <div className="flex flex-wrap gap-2">
                    {result.careerImpact.rolesUnlocked.map((role, idx) => (
                      <span key={idx} className="bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded text-sm">
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-lg font-bold mb-3">📋 Prerequisites</h3>
                <ul className="space-y-2">
                  {result.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-teal-400">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                <h3 className="text-lg font-bold mb-3">📝 Exam Format</h3>
                <div className="text-sm text-slate-300">{result.examFormat}</div>
                <div className="mt-2 text-sm text-slate-400">Passing: {result.passingScore}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">💡 Preparation Recommendations</h3>
              <ul className="space-y-2">
                {result.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-300">
                    <span className="text-cyan-400">✓</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex gap-4">
              <Link to="/ai/skill-roadmap" className="flex-1 rounded-lg bg-gradient-to-r from-teal-600 to-cyan-600 px-6 py-3 text-center font-semibold text-white hover:from-teal-500 hover:to-cyan-500 transition">
                🛣️ Create Learning Roadmap
              </Link>
              <Link to="/dashboard" className="flex-1 rounded-lg border border-slate-700 px-6 py-3 text-center font-semibold text-slate-300 hover:bg-slate-800 transition">
                ← Back to Dashboard
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CertificateAnalyzerPage;
