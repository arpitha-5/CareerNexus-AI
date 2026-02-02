import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/common/Navbar.jsx';
import FloatingChatbot from '../components/ai/FloatingChatbot.jsx';
import AIModulesSidebar from '../components/dashboard/AIModulesSidebar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getCareerGuidanceStatus } from '../api/careerGuidanceApi.js';
import '../styles/dashboard.css';

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [careerData, setCareerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // Navigation routes for steps
  const stepRoutes = {
    1: '/career/guidance',
    2: '/career/resume',
    3: '/career/interview',
    4: '/career/roadmap'
  };

  const handleStepClick = (stepNumber) => {
    setCurrentStep(stepNumber);
    navigate(stepRoutes[stepNumber]);
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  const handleSkillGapClick = (skill) => {
    navigate(`/career/roadmap?skill=${encodeURIComponent(skill)}`);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getCareerGuidanceStatus();
        setCareerData(response.data);

        // Determine current step based on completion status
        const steps = response.data.steps;
        const firstIncomplete = steps.findIndex(s => s.status === 'pending');
        setCurrentStep(firstIncomplete >= 0 ? firstIncomplete + 1 : 5);
      } catch (error) {
        console.error('Error loading career data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-[3px] border-indigo-600 border-t-transparent"></div>
          <p className="text-slate-500 mt-4 text-sm font-medium">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Sidebar */}
        <div className="w-72 bg-white border-r border-slate-200 overflow-y-auto custom-scrollbar flex-shrink-0 z-10 hidden md:block">
          <AIModulesSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-slate-50">
          <div className="max-w-6xl mx-auto px-8 py-10">

            {/* Header Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-10"
            >
              <div className="flex justify-between items-end border-b border-slate-200 pb-6">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Your AI Career Dashboard</h1>
                  <p className="text-slate-500 mt-2 text-base">Track your progress, analyze skills, and get AI-driven career guidance.</p>
                </div>
                <button
                  onClick={() => navigate('/career/guidance')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold shadow-sm transition-all flex items-center gap-2"
                >
                  <span className="text-lg">✨</span>
                  <span>New Analysis</span>
                </button>
              </div>
            </motion.div>

            {/* 3 Key Insights Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Card 1: Recommended Career */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                onClick={() => handleCardClick('/careers')}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-indigo-50 rounded-lg text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  </div>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2.5 py-1 rounded-full">92% Match</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">Recommended Career</h3>
                <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-indigo-600 transition-colors">Software Engineer</p>
                <div className="mt-4 flex items-center text-sm text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Career Path <span className="ml-1">→</span>
                </div>
              </motion.div>

              {/* Card 2: Skill Readiness Score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                onClick={() => handleCardClick('/career/guidance')}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  </div>
                  <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">+8% Growth</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">Skill Readiness</h3>
                <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-purple-600 transition-colors">78/100 Score</p>
                <div className="mt-4 flex items-center text-sm text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  Analyze Skills <span className="ml-1">→</span>
                </div>
              </motion.div>

              {/* Card 3: Career Readiness Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                onClick={() => handleCardClick('/career/roadmap')}
                className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md hover:border-teal-300 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-teal-50 rounded-lg text-teal-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                  </div>
                  <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">On Track</span>
                </div>
                <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wide">Career Status</h3>
                <p className="text-2xl font-bold text-slate-900 mt-2 group-hover:text-teal-600 transition-colors">Interview Ready</p>
                <div className="mt-4 flex items-center text-sm text-teal-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View Roadmap <span className="ml-1">→</span>
                </div>
              </motion.div>
            </div>

            {/* Progress Flow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl border border-slate-200 p-8 shadow-sm mb-10"
            >
              <h3 className="text-slate-800 text-lg font-bold mb-6">Your Progress</h3>
              <div className="relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-100 -translate-y-1/2 z-0 hidden md:block"></div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">
                  {[
                    {
                      step: 1,
                      label: 'Career Analysis',
                      desc: 'Identify your path',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                      )
                    },
                    {
                      step: 2,
                      label: 'Resume Review',
                      desc: 'ATS optimization',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      )
                    },
                    {
                      step: 3,
                      label: 'Interview Prep',
                      desc: 'Mock interviews',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                      )
                    },
                    {
                      step: 4,
                      label: 'Learning Roadmap',
                      desc: 'Skill building',
                      icon: (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                      )
                    }
                  ].map((item) => {
                    const isActive = item.step === currentStep;
                    const isCompleted = item.step < currentStep;

                    return (
                      <div
                        key={item.step}
                        onClick={() => handleStepClick(item.step)}
                        className={`flex flex-col items-center text-center cursor-pointer group transition-all transform ${isActive ? 'scale-105' : 'hover:scale-105'}`}
                      >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold mb-3 border-2 transition-all duration-300 z-10 relative ${isCompleted
                            ? 'bg-green-500 border-green-500 text-white shadow-md shadow-green-200 scale-100'
                            : isActive
                              ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white border-transparent shadow-lg shadow-indigo-500/40 scale-110 ring-4 ring-indigo-50'
                              : 'bg-slate-50 border-slate-200 text-slate-400 group-hover:bg-white group-hover:border-indigo-200 group-hover:text-indigo-500 group-hover:shadow-sm'
                          }`}>
                          {isCompleted ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          ) : item.icon}
                        </div>
                        <h4 className={`text-sm font-bold mb-1 transition-colors ${isActive || isCompleted ? 'text-slate-900' : 'text-slate-500 group-hover:text-indigo-600'}`}>
                          {item.label}
                        </h4>
                        <p className={`text-xs transition-colors ${isActive ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Bottom Section: Skills & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skill Gaps */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold text-slate-900">Priority Skill Gaps</h3>
                  <button onClick={() => navigate('/career/roadmap')} className="text-sm font-medium text-indigo-600 hover:text-indigo-700">View All</button>
                </div>
                <div className="space-y-4">
                  {[
                    { skill: 'System Design', impact: 'Critical', color: 'red' },
                    { skill: 'AWS Cloud', impact: 'High', color: 'orange' },
                    { skill: 'Advanced React', impact: 'Medium', color: 'yellow' }
                  ].map((gap, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSkillGapClick(gap.skill)}
                      className="flex items-center justify-between p-4 rounded-lg bg-slate-50 hover:bg-white hover:shadow-md border border-transparent hover:border-slate-200 transition-all cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-${gap.color}-500`}></div>
                        <span className="font-semibold text-slate-700">{gap.skill}</span>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded bg-${gap.color}-50 text-${gap.color}-700`}>
                        {gap.impact} Priority
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity Timeline */}
              <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Activity</h3>
                <div className="space-y-6 relative border-l-2 border-slate-100 ml-3 pl-6">
                  {[
                    { action: 'Completed "React Patterns"', time: '2 hours ago', icon: '📚' },
                    { action: 'Resume Score Improved (+5%)', time: 'Yesterday', icon: '📈' },
                    { action: 'Mock Interview: System Design', time: '2 days ago', icon: '🎤' }
                  ].map((activity, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[31px] top-0 w-6 h-6 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xs">
                        {activity.icon}
                      </div>
                      <p className="text-sm font-medium text-slate-800">{activity.action}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      <FloatingChatbot />
    </div>
  );
}

export default Dashboard;
