import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { motion } from 'framer-motion';

const ProjectGeneratorPage = () => {
  const [skills, setSkills] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateProjects = () => {
    setLoading(true);
    setTimeout(() => {
      setResult({
        projects: [
          {
            title: 'Real-Time Collaborative Code Editor',
            difficulty: 'Advanced',
            duration: '3-4 weeks',
            description: 'Build a web-based code editor where multiple users can collaborate in real-time, similar to Google Docs but for code. Perfect for showcasing WebSocket skills and real-time synchronization.',
            features: [
              'Real-time collaborative editing with WebSocket',
              'Syntax highlighting for multiple languages',
              'User presence indicators (who\'s online)',
              'Code execution in sandbox environment',
              'Chat functionality within editor',
              'Version history and rollback',
              'Room-based collaboration'
            ],
            techStack: ['React', 'Node.js', 'Socket.io', 'Monaco Editor', 'Redis', 'Docker'],
            apiEndpoints: [
              'POST /api/rooms - Create collaboration room',
              'GET /api/rooms/:id - Get room details',
              'WS /api/rooms/:id/collaborate - WebSocket for real-time editing',
              'POST /api/code/execute - Execute code in sandbox'
            ],
            learningOutcomes: ['WebSocket programming', 'Real-time data sync', 'Code execution sandboxing', 'State management at scale'],
            portfolioImpact: 'high',
            githubStars: '★★★★★'
          },
          {
            title: 'AI-Powered Resume Builder with ATS Optimization',
            difficulty: 'Intermediate',
            duration: '2-3 weeks',
            description: 'Create a smart resume builder that uses AI to optimize content for ATS (Applicant Tracking Systems). Analyzes job descriptions and suggests improvements.',
            features: [
              'Drag-and-drop resume builder',
              'AI-powered content suggestions',
              'ATS score calculator',
              'Multiple professional templates',
              'Job description analyzer',
              'Keyword optimization',
              'Export to PDF/DOCX',
              'LinkedIn profile import'
            ],
            techStack: ['React', 'Node.js', 'OpenAI API', 'MongoDB', 'Puppeteer', 'Tailwind CSS'],
            apiEndpoints: [
              'POST /api/resume - Create/update resume',
              'POST /api/analyze - Analyze resume against JD',
              'POST /api/suggestions - Get AI suggestions',
              'GET /api/templates - Get resume templates',
              'POST /api/export - Export to PDF/DOCX'
            ],
            learningOutcomes: ['AI API integration', 'PDF generation', 'Content analysis', 'Template engine design'],
            portfolioImpact: 'high',
            githubStars: '★★★★☆'
          },
          {
            title: 'Social Media Analytics Dashboard',
            difficulty: 'Intermediate',
            duration: '2 weeks',
            description: 'Build a comprehensive analytics dashboard that aggregates data from multiple social media platforms. Includes charts, trends, and engagement metrics.',
            features: [
              'Multi-platform data aggregation',
              'Interactive charts and graphs',
              'Engagement rate calculations',
              'Best posting time analyzer',
              'Hashtag performance tracking',
              'Competitor comparison',
              'Automated reporting',
              'Real-time notifications'
            ],
            techStack: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Chart.js', 'Twitter API', 'Instagram API'],
            apiEndpoints: [
              'GET /api/platforms/:platform/data - Fetch platform data',
              'GET /api/analytics/engagement - Calculate engagement metrics',
              'GET /api/analytics/trends - Get trending topics',
              'POST /api/reports/generate - Generate PDF reports',
              'GET /api/competitors/:id - Compare with competitors'
            ],
            learningOutcomes: ['Data visualization', 'API integration', 'Analytics algorithms', 'Third-party OAuth'],
            portfolioImpact: 'medium',
            githubStars: '★★★★☆'
          }
        ],
        nextSteps: [
          'Start with wireframing and system design',
          'Set up Git repository with proper README',
          'Break project into weekly milestones',
          'Deploy MVP and iterate based on feedback'
        ],
        similarProjects: ['DevConnect', 'Resume.io', 'Hootsuite'],
        estimatedLearningHours: 80-100
      });
      setLoading(false);
    }, 1500);
  };

  const getDifficultyColor = (diff) => {
    if (diff === 'Advanced') return 'text-red-400 bg-red-500/20';
    if (diff === 'Intermediate') return 'text-amber-400 bg-amber-500/20';
    return 'text-green-400 bg-green-500/20';
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
            <div className="text-5xl">🚀</div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
                AI Project Generator
              </h1>
              <p className="text-slate-400 mt-1">Get industry-level project ideas tailored to your skills & career goals</p>
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
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-3">Your Skills</label>
              <textarea
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., React, Node.js, MongoDB, WebSocket, REST APIs..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-pink-500 focus:outline-none resize-none"
                rows="3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-3">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g., Full-Stack Developer, Frontend Engineer..."
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-pink-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-3">Project Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full rounded-lg bg-slate-950 border border-slate-700 px-4 py-3 text-sm text-slate-100 focus:border-pink-500 focus:outline-none"
              >
                <option value="beginner">Beginner - Learning fundamentals</option>
                <option value="intermediate">Intermediate - Building portfolio</option>
                <option value="advanced">Advanced - Production-ready</option>
              </select>
            </div>
            <button
              onClick={generateProjects}
              disabled={loading || !skills || !targetRole}
              className="mt-4 w-full rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-3 font-semibold text-white hover:from-fuchsia-500 hover:to-pink-500 disabled:opacity-50 transition"
            >
              {loading ? 'Generating Projects...' : '🚀 Generate Project Ideas'}
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
            {/* Project Cards */}
            {result.projects.map((project, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.15 }}
                className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6"
              >
                {/* Project Header */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-2xl font-bold text-fuchsia-400">{project.title}</h3>
                    <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getDifficultyColor(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  </div>
                  <p className="text-slate-300 mb-3">{project.description}</p>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span>⏱️ {project.duration}</span>
                    <span>📊 Portfolio Impact: {project.portfolioImpact}</span>
                    <span className="text-amber-400">{project.githubStars}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">✨ Key Features</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {project.features.map((feature, fidx) => (
                      <div key={fidx} className="flex items-start gap-2 text-sm text-slate-300">
                        <span className="text-green-400 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tech Stack */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">🛠️ Tech Stack</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.map((tech, tidx) => (
                      <span key={tidx} className="bg-slate-800/50 text-pink-300 px-3 py-1 rounded-lg text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* API Endpoints */}
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">🔌 API Endpoints to Build</h4>
                  <div className="space-y-1">
                    {project.apiEndpoints.map((endpoint, eidx) => (
                      <div key={eidx} className="rounded bg-slate-800/30 px-3 py-2 font-mono text-xs text-slate-300">
                        {endpoint}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Learning Outcomes */}
                <div className="rounded-lg bg-gradient-to-r from-fuchsia-500/10 to-pink-500/10 border border-fuchsia-500/30 p-4">
                  <h4 className="font-semibold mb-2">📚 What You'll Learn</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.learningOutcomes.map((outcome, oidx) => (
                      <span key={oidx} className="bg-slate-900/50 text-fuchsia-300 px-3 py-1 rounded text-sm">
                        {outcome}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Next Steps */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">📋 Next Steps to Get Started</h3>
              <ol className="space-y-2">
                {result.nextSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-slate-300">
                    <span className="bg-fuchsia-500/20 text-fuchsia-300 w-6 h-6 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Similar Projects */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
              <h3 className="text-xl font-bold mb-4">🔍 Similar Successful Projects</h3>
              <div className="flex flex-wrap gap-3">
                {result.similarProjects.map((proj, idx) => (
                  <span key={idx} className="bg-slate-800/50 text-slate-300 px-4 py-2 rounded-lg">
                    {proj}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-400 mt-4">
                💡 Estimated Learning Time: {result.estimatedLearningHours} hours
              </p>
            </div>

            {/* CTA */}
            <div className="flex gap-4">
              <Link
                to="/ai/weekly-goals"
                className="flex-1 rounded-lg bg-gradient-to-r from-fuchsia-600 to-pink-600 px-6 py-3 text-center font-semibold text-white hover:from-fuchsia-500 hover:to-pink-500 transition"
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

export default ProjectGeneratorPage;
