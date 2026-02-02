import React from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { motion } from 'framer-motion';

const FeaturesPage = () => {
  const { theme } = useTheme();

  const features = [
    {
      icon: '🧭',
      title: 'AI Career Guidance System',
      description:
        'Uses your skills, interests, and academic background to recommend the most suitable career path with clear reasoning.',
      color: 'from-indigo-500 to-purple-500',
    },
    {
      icon: '🧠',
      title: 'Explainable AI Decisions',
      description:
        'Every recommendation comes with a “WHY” — skills matched, interests aligned, and gaps identified transparently.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '🎯',
      title: 'Skill Gap Analysis',
      description:
        'Compares your current skills with industry requirements and highlights missing skills with priority levels.',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: '🗺️',
      title: 'Personalized Career Roadmap',
      description:
        'AI-generated 6–12 month roadmap with phase-wise learning goals to move from student to job-ready.',
      color: 'from-orange-500 to-red-500',
    },
    {
      icon: '📄',
      title: 'AI Resume Analyzer',
      description:
        'Analyzes your resume against your chosen career path to identify strengths, weaknesses, and improvements.',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '📊',
      title: 'Resume Skill Match Score',
      description:
        'Provides a score showing how well your resume matches your target role, along with actionable suggestions.',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: '🎤',
      title: 'AI Interview Preparation Assistant',
      description:
        'Practice behavioral, technical, and scenario-based questions with AI feedback and ideal sample answers.',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: '🏢',
      title: 'Company & Role-Based Interviews',
      description:
        'Generate targeted interview questions based on selected company and role for realistic preparation.',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: '📥',
      title: 'Interview Questions PDF Generator',
      description:
        'Download company-specific and role-specific interview questions as a ready-to-use PDF.',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: '📈',
      title: 'Interview Readiness Score',
      description:
        'AI evaluates your answers and gives a readiness score to track improvement over time.',
      color: 'from-emerald-500 to-teal-500',
    },
    {
      icon: '👤',
      title: 'Dynamic Student Profile',
      description:
        'Editable profile where students update skills, interests, and goals — used across all AI modules.',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: '⚡',
      title: 'End-to-End Career Flow',
      description:
        'Profile → Career Guidance → Skill Gap → Resume Analysis → Interview Preparation — all in one platform.',
      color: 'from-violet-500 to-purple-500',
    },
  ];

  return (
    <div className="min-h-screen theme-bg" data-theme={theme}>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AI-Powered Career Guidance Features
          </h1>
          <p className="text-lg theme-text-muted max-w-3xl mx-auto">
            A data-driven AI system that helps students choose the right career,
            build the right skills, and prepare confidently for interviews.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              className="theme-card p-6 border border-slate-700 hover:border-indigo-500 transition-all"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: '0 0 30px rgba(99, 102, 241, 0.3)',
              }}
            >
              <div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-3xl mb-4`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-sm theme-text-muted leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-16 text-center theme-card p-12 border border-indigo-500/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <h2 className="text-3xl font-bold mb-4">
            Ready to Discover Your Ideal Career?
          </h2>
          <p className="text-lg theme-text-muted mb-8 max-w-2xl mx-auto">
            Let AI guide your career decisions with clarity, confidence, and real-world insights.
          </p>
          <motion.a
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-lg text-lg"
            whileHover={{
              scale: 1.1,
              boxShadow: '0 0 30px rgba(99, 102, 241, 0.6)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Start Career Guidance →
          </motion.a>
        </motion.div>
      </div>
    </div>
  );
};

export default FeaturesPage;
