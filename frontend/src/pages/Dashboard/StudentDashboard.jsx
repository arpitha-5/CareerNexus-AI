import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import Navbar from '../../components/common/Navbar.jsx';
import AIModulesSidebar from '../../components/dashboard/AIModulesSidebar.jsx';
import { fetchParsedResume } from '../../api/aiApi.js';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import '../../styles/dashboard.css';

const MotionCard = motion.div;

const Card = ({ title, children, className = '', gradient = false }) => (
  <MotionCard
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut' }}
    whileHover={{ y: -4, transition: { duration: 0.2 } }}
    className={`rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 p-6 ${gradient ? 'bg-gradient-to-br from-green-50/50 to-white' : ''} ${className}`}
  >
    <p className="mb-4 text-[10px] font-bold uppercase tracking-wider text-gray-500">{title}</p>
    {children}
  </MotionCard>
);

const RESUME_ANALYZER_PROMPT = `You are an AI system powering an AI-Based Personalized Learning Platform.

🎯 Your Solution

Build an AI-based system with the following capabilities:

---------------------------------------------------------
1️⃣ Resume → Skill Extraction Engine
---------------------------------------------------------
- Accept a resume in text/PDF-extracted form.
- Extract technical skills, soft skills, tools, and experience.
- Normalize skills (e.g., React.js → React).
- Generate confidence scores for each skill.
- Map extracted skills to a standardized skill graph (frontend, backend, database, tools).

---------------------------------------------------------
2️⃣ Skill Gap Detection
---------------------------------------------------------
- Compare student skills vs current industry-required skills for a selected target role.
- Identify missing skills.
- Detect weak skills (low confidence).
- Generate a prioritized improvement list.
- Output a visual-friendly JSON format for charts and UI usage.

---------------------------------------------------------
3️⃣ Personalized Learning Path Generator
---------------------------------------------------------
Based on identified skill gaps, learning speed, and weekly hours:
- Generate structured modules.
- Recommend high-quality courses.
- Include practical projects.
- Suggest weekly quizzes.
- Build a step-by-step roadmap timeline (Week 1 → Week 4 or Week 8).
- Output fully structured JSON only.

---------------------------------------------------------
4️⃣ Adaptive Learning Tracker
---------------------------------------------------------
As the student progresses:
- Analyze completed tasks.
- Adjust the difficulty level.
- Regenerate next steps dynamically.
- Provide feedback messages.
- Recommend new tasks based on performance.
- Continuously update skill readiness levels.

---------------------------------------------------------
5️⃣ AI Chatbot Mentor
---------------------------------------------------------
Act as an intelligent mentor that:
- Helps with resume improvement.
- Suggests skills to learn next.
- Guides students through courses.
- Answers doubts.
- Provides help with code or concepts.
- Gives encouraging feedback to the learner.

---------------------------------------------------------
🧱 System Architecture (What you are powering)
---------------------------------------------------------
Frontend (React pages you serve):
- ResumeUploadPage
- SkillGapReportPage
- LearningPathPage
- AdaptiveTrackerPage
- ChatbotPage
- StudentDashboard

Backend Endpoints (Node.js + Express):
- /upload-resume
- /extract-skills
- /skill-gap
- /generate-learning-path
- /adaptive-update
- /chatbot

AI Model Capabilities (You):
- Resume parser
- Skill normalizer
- Skill gap analyzer
- Learning path generator
- Adaptive learning engine
- Chatbot mentor

---------------------------------------------------------
IMPORTANT:
Always return responses in clean, structured JSON only.
Never include explanations, markdown, or extra text.
All outputs must be concise, accurate, and ready for UI consumption.`;

const StudentDashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [leaderboard, setLeaderboard] = useState([]);
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [resumeInsights, setResumeInsights] = useState(null);
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeError, setResumeError] = useState(null);

  // Mock data - replace with API calls
  useEffect(() => {
    // Simulate leaderboard data
    setLeaderboard([
      { rank: 1, name: 'Arpitha', xp: 12500, level: 12 },
      { rank: 2, name: 'Chandana', xp: 11800, level: 11 },
      { rank: 3, name: user?.name || 'You', xp: user?.gamification?.xp || 0, level: user?.gamification?.level || 1 },
      { rank: 4, name: 'Nithiin', xp: 9800, level: 9 },
      { rank: 5, name: 'Adi', xp: 9200, level: 9 },
    ]);

    // Mock quiz data
    setRecentQuizzes([
      { id: 1, title: 'JavaScript Fundamentals', score: 85, date: '2024-01-15', difficulty: 'medium' },
      { id: 2, title: 'React Hooks', score: 92, date: '2024-01-14', difficulty: 'hard' },
      { id: 3, title: 'Node.js Basics', score: 78, date: '2024-01-13', difficulty: 'easy' },
    ]);

    // Mock progress data for charts
    setProgressData([
      { week: 'Week 1', xp: 1200, quizzes: 3 },
      { week: 'Week 2', xp: 1800, quizzes: 5 },
      { week: 'Week 3', xp: 2400, quizzes: 7 },
      { week: 'Week 4', xp: 2100, quizzes: 6 },
    ]);
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const loadResumeInsights = async () => {
      setResumeLoading(true);
      setResumeError(null);
      try {
        const { data } = await fetchParsedResume();
        const ats = data?.atsAnalysis || {};
        const normalized = {
          score: ats.atsScore ?? user?.profile?.resumeScore ?? 0,
          atsMatch: ats.atsScore ?? user?.profile?.resumeScore ?? 0,
          keywordCoverage: Math.max(35, 100 - ((ats.missingKeywords?.length || 0) * 5)),
          strengths: ats.strengths || [],
          improvements: ats.suggestions?.length ? ats.suggestions : ats.weaknesses || [],
          missingKeywords: ats.missingKeywords || [],
          parsedSummary: {
            technicalSkills: data?.parsed?.technicalSkills?.length || 0,
            projects: data?.parsed?.projects?.length || 0,
            experience: data?.parsed?.experience?.length || 0,
          },
        };
        setResumeInsights(normalized);
      } catch (err) {
        if (err?.response?.status === 404) {
          setResumeInsights(null);
        } else {
          setResumeError(err?.response?.data?.message || 'Unable to analyze resume right now.');
        }
      } finally {
        setResumeLoading(false);
      }
    };

    loadResumeInsights();
  }, [user]);

  const xpData = [
    { name: 'Courses', value: 40 },
    { name: 'Quizzes', value: 30 },
    { name: 'Projects', value: 20 },
    { name: 'Community', value: 10 },
  ];

  const COLORS = ['#6366f1', '#0ea5e9', '#22c55e', '#f59e0b'];

  return (
    <div className="min-h-screen theme-bg" data-theme={theme}>
      <Navbar />
      <div className="mx-auto max-w-7xl px-6 pt-28 pb-12 space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent tracking-tight">
            Welcome back, {user?.name || 'Student'} 
          </h1>
          <p className="text-sm theme-text-muted max-w-2xl">
            Your adaptive learning hub: track XP, streaks, courses, AI mentor chats, and internship opportunities.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-4">
          <Card title="XP & Level" gradient>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-black bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                {user?.gamification?.xp ?? 0}
              </div>
              <div className="text-sm">
                <div className="font-bold text-gray-700">Level {user?.gamification?.level ?? 1}</div>
                <div className="text-gray-500 text-xs">Streak: {user?.gamification?.streakDays ?? 0} days 🔥</div>
              </div>
            </div>
            <div className="mt-3 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${((user?.gamification?.xp ?? 0) % 1000) / 10}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
              />
            </div>
          </Card>

          <Card title="Badges Earned">
            <div className="text-4xl font-black bg-gradient-to-r from-yellow-500 to-amber-500 bg-clip-text text-transparent mb-2">
              {user?.gamification?.badges?.length || 0}
            </div>
            <div className="flex gap-2 mt-3">
              {user?.gamification?.badges?.slice(0, 3).map((badge, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring' }}
                  className="text-2xl"
                >
                  🏆
                </motion.span>
              ))}
              {(!user?.gamification?.badges || user?.gamification?.badges?.length === 0) && (
                <span className="text-sm text-gray-400">No badges yet</span>
              )}
            </div>
          </Card>

          <Card title="Resume Score">
            <div className="text-4xl font-black bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent mb-2">
              {user?.profile?.resumeScore ?? 0}
            </div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-semibold">ATS-Optimized</div>
            <Link
              to="/ai/resume-upload"
              className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              Improve Resume →
            </Link>
          </Card>

          <Card title="Courses Completed">
            <div className="text-4xl font-black bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
              12
            </div>
            <div className="text-[10px] uppercase tracking-wider text-gray-500 mt-1 font-semibold">3 in progress</div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Column - 2 spans */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Path */}
            <Card title=" Personalized Learning Path" gradient>
              <div className="space-y-4">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Generated from your resume and skill gaps. Adapts based on your performance.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/ai/learning-path"
                    className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-5 py-2.5 text-xs font-bold text-white hover:from-green-600 hover:to-emerald-600 transition-all shadow-md hover:shadow-lg"
                  >
                    📅 View Weekly Plan
                  </Link>
                  <Link
                    to="/ai/skill-gaps"
                    className="rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:border-green-300 hover:bg-green-50 transition-all"
                  >
                    Skill Gap Report
                  </Link>
                  <Link
                    to="/ai/adaptive-tracker"
                    className="rounded-xl border-2 border-gray-200 bg-white px-5 py-2.5 text-xs font-semibold text-gray-700 hover:border-blue-300 hover:bg-blue-50 transition-all"
                  >
                    Adaptive Engine
                  </Link>
                </div>
              </div>
            </Card>

            {/* Progress Charts */}
            <Card title=" Learning Progress">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="week" stroke="#6b7280" fontSize={11} fontWeight={600} />
                  <YAxis stroke="#6b7280" fontSize={11} fontWeight={600} />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: '#ffffff', 
                      border: '1px solid #e5e7eb', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', fontWeight: 600 }} />
                  <Line type="monotone" dataKey="xp" stroke="#22c55e" strokeWidth={3} name="XP Earned" dot={{ fill: '#22c55e', r: 4 }} />
                  <Line type="monotone" dataKey="quizzes" stroke="#60a5fa" strokeWidth={3} name="Quizzes Taken" dot={{ fill: '#60a5fa', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Recent Quizzes */}
            <Card title=" Recent Quiz Performance">
              <div className="space-y-3">
                {recentQuizzes.map((quiz, idx) => (
                  <motion.div
                    key={quiz.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center justify-between rounded-xl bg-gradient-to-r from-gray-50 to-white border border-gray-100 px-4 py-3 hover:shadow-md transition-all"
                  >
                    <div>
                      <div className="font-bold text-sm text-gray-800">{quiz.title}</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">{quiz.date}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-black text-lg ${
                        quiz.score >= 90 ? 'text-green-500' :
                        quiz.score >= 70 ? 'text-yellow-500' : 'text-red-500'
                      }`}>
                        {quiz.score}%
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-gray-400 font-semibold">{quiz.difficulty}</div>
                    </div>
                  </motion.div>
                ))}
                <Link
                  to="/courses"
                  className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-700 mt-4 transition-colors"
                >
                  View All Quizzes →
                </Link>
              </div>
            </Card>

            {/* AI Resume Analyzer */}
            <Card title=" AI-Driven Resume Analyzer" gradient>
              <div className="space-y-5">
                {resumeLoading && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                    <div className="animate-spin text-2xl"></div>
                    <p className="text-sm font-semibold text-blue-700">Analyzing latest resume...</p>
                  </div>
                )}
                {resumeError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-700">{resumeError}</p>
                  </div>
                )}
                {!resumeLoading && !resumeError && !resumeInsights && (
                  <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl text-center">
                    <div className="text-4xl mb-3">📄</div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Upload a resume to unlock insights
                    </p>
                    <p className="text-xs text-gray-500">
                      Get ATS score, missing keywords, and AI suggestions
                    </p>
                  </div>
                )}
                {resumeInsights && (
                  <>
                    <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-5 border border-blue-100">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">ATS Score</p>
                        <p className="text-4xl font-black bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          {resumeInsights.score ?? '—'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-1">Keyword Coverage</p>
                        <p className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {`${resumeInsights.keywordCoverage}%`}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2">ATS Alignment</p>
                      <div className="h-4 w-full rounded-full bg-gray-100 shadow-inner overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${resumeInsights.atsMatch}%` }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="rounded-xl border-2 border-gray-100 bg-white p-4">
                        <p className="text-xs font-bold text-gray-700 mb-3">Parsed Snapshot</p>
                        <div className="space-y-1.5 text-xs text-gray-600">
                          <p><span className="font-semibold">Skills:</span> {resumeInsights.parsedSummary.technicalSkills}</p>
                          <p><span className="font-semibold">Projects:</span> {resumeInsights.parsedSummary.projects}</p>
                          <p><span className="font-semibold">Experience:</span> {resumeInsights.parsedSummary.experience}</p>
                        </div>
                      </div>
                      <div className="rounded-xl border-2 border-gray-100 bg-white p-4">
                        <p className="text-xs font-bold text-gray-700 mb-3">Strengths</p>
                        <div className="flex flex-wrap gap-2">
                          {resumeInsights.strengths.length === 0 && <span className="text-xs text-gray-400">—</span>}
                          {resumeInsights.strengths.map((item) => (
                            <span
                              key={item}
                              className="rounded-full bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1 text-[10px] font-semibold text-green-700"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="rounded-xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 p-4">
                      <p className="text-xs font-bold text-gray-700 mb-3"> AI Suggestions</p>
                      <ul className="space-y-2 text-xs text-gray-700">
                        {resumeInsights.improvements.length === 0 && <li className="text-gray-400">No suggestions yet.</li>}
                        {resumeInsights.improvements.map((tip) => (
                          <li key={tip} className="flex items-start gap-2">
                            <span className="text-green-500 font-bold mt-0.5">✓</span>
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="rounded-xl border-2 border-gray-100 bg-white p-4">
                      <p className="text-xs font-bold text-gray-700 mb-3"> Missing Keywords</p>
                      <div className="flex flex-wrap gap-2">
                        {resumeInsights.missingKeywords.length === 0 && <span className="text-xs font-semibold text-green-600">✓ All covered!</span>}
                        {resumeInsights.missingKeywords.map((keyword) => (
                          <span key={keyword} className="rounded-lg bg-red-100 border border-red-200 px-3 py-1.5 text-[10px] font-semibold text-red-700">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/ai/resume-upload"
                    className="flex-1 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-3 text-center text-xs font-bold text-white hover:from-purple-600 hover:to-pink-600 transition-all shadow-md hover:shadow-lg"
                  >
                    Run Deep Analysis
                  </Link>
                  <Link
                    to="/ai/resume-upload"
                    className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-center text-xs font-semibold text-gray-700 hover:border-purple-300 hover:bg-purple-50 transition-all"
                  >
                    View History
                  </Link>
                </div>
              </div>
            </Card>

            {/* AI Resume Intelligence Module */}
            
                

            
               

            {/* Quick Access */}
            <Card title=" Quick Access">
              <div className="grid grid-cols-2 gap-3">
                <Link
                  to="/ai/chatbot"
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 p-6 text-center hover:from-green-500 hover:via-emerald-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-2xl hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-2 animate-bounce"></div>
                    <div className="text-xs font-black text-white">Ask LearnBuddy</div>
                    <div className="text-[9px] text-green-100 font-medium mt-1">AI Assistant</div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>
                <Link
                  to="/community"
                  className="group relative overflow-hidden rounded-2xl border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-white p-6 text-center hover:border-purple-400 hover:from-purple-100 hover:to-purple-50 transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-2"></div>
                    <div className="text-xs font-black text-gray-800">Community</div>
                    <div className="text-[9px] text-purple-600 font-medium mt-1">Forum</div>
                  </div>
                </Link>
                <Link
                  to="/internships"
                  className="group relative overflow-hidden rounded-2xl border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-white p-6 text-center hover:border-blue-400 hover:from-blue-100 hover:to-blue-50 transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-2"></div>
                    <div className="text-xs font-black text-gray-800">Internships</div>
                    <div className="text-[9px] text-blue-600 font-medium mt-1">Job Hub</div>
                  </div>
                </Link>
                <Link
                  to="/profile"
                  className="group relative overflow-hidden rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white p-6 text-center hover:border-pink-400 hover:from-pink-100 hover:to-pink-50 transition-all hover:shadow-lg hover:scale-105"
                >
                  <div className="relative z-10">
                    <div className="text-4xl mb-2"></div>
                    <div className="text-xs font-black text-gray-800">My Profile</div>
                    <div className="text-[9px] text-pink-600 font-medium mt-1">Settings</div>
                  </div>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Leaderboard */}
            <Card title="🏆 Leaderboard">
              <div className="space-y-3">
                {leaderboard.map((entry, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                      entry.name === (user?.name || 'You')
                        ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300 shadow-md'
                        : 'bg-gradient-to-r from-gray-50 to-white border border-gray-100 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-sm font-black w-6 ${
                        entry.rank === 1 ? 'text-yellow-500' :
                        entry.rank === 2 ? 'text-gray-400' :
                        entry.rank === 3 ? 'text-orange-600' :
                        'text-gray-400'
                      }`}>
                        #{entry.rank}
                      </span>
                      <span className="text-sm font-bold text-gray-800">{entry.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {entry.xp.toLocaleString()}
                      </div>
                      <div className="text-[9px] uppercase tracking-wider text-gray-500 font-semibold">Lv.{entry.level}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* XP Distribution */}
            <Card title="XP Distribution">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={xpData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {xpData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={['#22c55e', '#60a5fa', '#c4b5fd', '#facc15'][index % 4]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Quick Actions - New Collapsible Sidebar */}
            <MotionCard
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="rounded-2xl bg-white/80 backdrop-blur-sm border border-gray-100 shadow-lg p-6"
            >
              <AIModulesSidebar />
            </MotionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
