import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import FloatingChatbot from '../../components/ai/FloatingChatbot.jsx';
import SkillDependencyGraph from '../../components/career/SkillDependencyGraph.jsx';
import RecruiterSignalCard from '../../components/career/RecruiterSignalCard.jsx';
import { generateSkillGaps, evaluateHiringSignal } from '../../api/aiApi.js';

const SkillGapPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
    const [expandedSkill, setExpandedSkill] = useState(null);
    const [gapData, setGapData] = useState({
        targetRole: 'Full Stack Developer',
        readinessScore: 0,
        missingSkills: [],
        strongSkills: [],
        dependencyGraph: [],
        aiInsight: 'Analyzing your profile...'
    });
    const [hiringSignal, setHiringSignal] = useState(null);

    useEffect(() => {
        const fetchSkillGaps = async () => {
            // Get role from navigation state or default to Full Stack
            const targetRole = location.state?.role || 'Full Stack Developer';
            setLoading(true);

            // Rich Fallback Data (Demo Mode)
            const fallbackData = {
                targetRole: targetRole,
                readinessScore: 65,
                strongSkills: ['JavaScript', 'React', 'Problem Solving', 'Communication'],
                missingSkills: [
                    {
                        name: 'Docker & Kubernetes',
                        importance: 'High',
                        timeToLearn: '2 Weeks',
                        reason: 'Crucial for modern DevOps and containerization protocols used in enterprise roles.',
                        category: 'DevOps',
                        learningPlan: {
                            description: 'Learn to containerize apps and orchestrate them.',
                            steps: ['Install Docker & Run Hello World', 'Create a Dockerfile for a Node App', 'Understand Kubernetes Pods/Services', 'Deploy to Minikube']
                        }
                    },
                    {
                        name: 'System Design',
                        importance: 'High',
                        timeToLearn: '3 Weeks',
                        reason: 'Required for designing scalable architectures; a key differentiator for senior roles.',
                        category: 'Architecture',
                        learningPlan: {
                            description: 'Master scalability and distributed systems.',
                            steps: ['Load Balancing basics', 'Caching strategies (Redis)', 'Database Sharding', 'Design a URL Shortener']
                        }
                    },
                    {
                        name: 'GraphQL',
                        importance: 'Medium',
                        timeToLearn: '1 Week',
                        reason: 'Many modern startups prefer GraphQL over REST for efficient data fetching.',
                        category: 'Backend',
                        learningPlan: {
                            description: 'Query precisely what you need.',
                            steps: ['GraphQL vs REST', 'Write a Query', 'Write a Mutation', 'Connect with Apollo Client']
                        }
                    }
                ],
                dependencyGraph: [
                    {
                        skill: 'JavaScript',
                        unlocks: ['React', 'Node.js'],
                        reason: 'The core language for all web development.',
                        topics: ['ES6+ Syntax', 'Async/Await', 'DOM Manipulation', 'Event Loop'],
                        resources: [
                            { name: 'MDN Web Docs', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
                            { name: 'JavaScript.info', url: 'https://javascript.info/' }
                        ]
                    },
                    {
                        skill: 'React',
                        prerequisites: ['JavaScript'],
                        unlocks: ['Next.js', 'Redux'],
                        reason: 'Dominant frontend library requiring solid JS fundamentals.',
                        topics: ['Components & Props', 'Hooks (useState, useEffect)', 'Context API', 'React Router'],
                        resources: [
                            { name: 'React Official Docs', url: 'https://react.dev/' },
                            { name: 'Epic React by Kent C. Dodds', url: 'https://epicreact.dev/' }
                        ]
                    },
                    {
                        skill: 'Node.js',
                        prerequisites: ['JavaScript'],
                        unlocks: ['Express', 'Backend Systems'],
                        reason: 'Server-side runtime for JavaScript.',
                        topics: ['Event Emitter', 'File System (fs)', 'HTTP Module', 'Streams & Buffers'],
                        resources: [
                            { name: 'Node.js Crash Course', url: 'https://nodejs.org/en/docs/guides/getting-started-guide/' }
                        ]
                    }
                ],
                aiInsight: `Based on your profile, you are a strong candidate for Junior roles, but mastering System Design and DevOps will fast-track you to Mid-Senior levels in ${targetRole}.`
            };

            try {
                // Parallel Fetch: Skill Gaps + Hiring Signal
                const [gapDataResponse, signalResponse] = await Promise.all([
                    generateSkillGaps(targetRole),
                    evaluateHiringSignal(targetRole)
                ]);

                // Handle Gap Data
                if (gapDataResponse.data && gapDataResponse.data.missingSkills && gapDataResponse.data.missingSkills.length > 0) {
                    setGapData({
                        ...gapDataResponse.data,
                        targetRole: gapDataResponse.data.targetRole || targetRole
                    });
                } else {
                    console.warn("API returned empty data, using fallback.");
                    setGapData(fallbackData);
                }

                // Handle Hiring Signal
                if (signalResponse.data) {
                    setHiringSignal(signalResponse.data);
                }
            } catch (error) {
                console.error("Failed to fetch AI analysis", error);
                setGapData(fallbackData);
                // Fallback signal data for demo
                setHiringSignal({
                    resumeSignalStrength: 72,
                    skillMatchScore: 65,
                    projectRelevanceScore: 58,
                    interviewProbability: 45,
                    recruiterInsight: "Strong potential in frontend but lacks enterprise-scale backend experience. Projects are good but need more deployment details."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchSkillGaps();
    }, [location.state]);

    const toggleLearningPlan = (index) => {
        if (expandedSkill === index) {
            setExpandedSkill(null);
        } else {
            setExpandedSkill(index);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-semibold text-slate-800 animate-pulse">Analyzing technical gaps...</h2>
                    <p className="text-slate-500 mt-2">Comparing your profile against industry benchmarks for <span className="font-bold">{gapData.targetRole}</span></p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 max-w-6xl mx-auto px-6 py-10 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        AI Skill Analysis
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-2">Skill Gap Engine</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Identified gaps between your current skill set and the requirements for <span className="font-bold text-slate-800">{gapData.targetRole}</span>.
                    </p>

                </motion.div>

                {/* Recruiter Signal Evaluator */}
                <RecruiterSignalCard signalData={hiringSignal} />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Readiness Score Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="md:col-span-1 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 to-red-500"></div>
                        <h3 className="text-slate-500 font-semibold mb-6 uppercase tracking-wider text-sm">Role Readiness</h3>

                        <div className="relative w-40 h-40 flex items-center justify-center mb-6">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
                                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={440} strokeDashoffset={440 - (440 * gapData.readinessScore) / 100} className="text-orange-500 transition-all duration-1000 ease-out" />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center flex-col">
                                <span className="text-4xl font-bold text-slate-800">{gapData.readinessScore}%</span>
                                <span className="text-xs text-slate-400 font-medium">Ready</span>
                            </div>
                        </div>

                        <p className="text-slate-600 text-sm px-4">
                            You are on track but need to master <strong>3 key skills</strong> to be fully job-ready.
                        </p>
                    </motion.div>

                    {/* Strong Skills */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 }}
                        className="md:col-span-2 bg-white rounded-2xl p-8 shadow-sm border border-slate-200 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-500 to-emerald-500"></div>
                        <h3 className="text-slate-500 font-semibold mb-6 uppercase tracking-wider text-sm">Your Strongest Assets</h3>
                        <div className="flex flex-wrap gap-3">
                            {gapData.strongSkills.map((skill, idx) => (
                                <span key={idx} className="px-4 py-2 bg-green-50 text-green-700 font-bold rounded-lg border border-green-100 select-none hover:bg-green-100 transition-colors">
                                    {skill}
                                </span>
                            ))}
                            <span className="px-4 py-2 bg-slate-50 text-slate-500 font-semibold rounded-lg border border-slate-200 border-dashed">
                                + 4 others
                            </span>
                        </div>

                        <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100 flex gap-4 items-start">

                            <div>
                                <h4 className="font-bold text-slate-800 text-sm">AI Insight</h4>
                                <p className="text-slate-600 text-sm mt-1">Your foundation in React and Node.js is excellent. Focusing on DevOps (Docker) will make you a standout candidate for Senior roles.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Dependency Graph */}
                <SkillDependencyGraph graphData={gapData.dependencyGraph} />

                {/* Missing Skills List */}
                <div className="mb-12">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <span className="text-red-500">⚠️</span> Critical Skill Gaps
                    </h3>
                    <div className="space-y-4">
                        {gapData.missingSkills?.map((skill, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                className={`bg-white rounded-xl shadow-sm border transition-all overflow-hidden ${expandedSkill === idx ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-orange-300 hover:shadow-md'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="text-lg font-bold text-slate-800">{skill.name}</h4>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${skill.importance === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>
                                                    {skill.importance} Priority
                                                </span>
                                            </div>
                                            <p className="text-slate-600 text-sm">{skill.reason}</p>
                                        </div>

                                        <div className="flex items-center gap-6 md:border-l md:border-slate-100 md:pl-6 min-w-[200px]">
                                            <div>
                                                <p className="text-xs text-slate-400 font-bold uppercase">Est. Time</p>
                                                <p className="text-sm font-bold text-slate-700">{skill.timeToLearn}</p>
                                            </div>
                                            <button
                                                onClick={() => toggleLearningPlan(idx)}
                                                className={`ml-auto px-4 py-2 text-sm font-semibold rounded-lg transition-colors border ${expandedSkill === idx
                                                    ? 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                                    : 'bg-slate-900 text-white border-transparent hover:bg-indigo-600'
                                                    }`}
                                            >
                                                {expandedSkill === idx ? 'Hide Plan' : 'Start Learning'}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Inline Learning Plan */}
                                <AnimatePresence>
                                    {expandedSkill === idx && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="bg-slate-50 border-t border-slate-200"
                                        >
                                            <div className="p-6">
                                                <h5 className="font-bold text-indigo-700 mb-2 flex items-center gap-2">
                                                    Recommended Learning for {skill.name}
                                                </h5>
                                                <p className="text-sm text-slate-600 mb-4 italic">
                                                    "{skill.learningPlan.description}"
                                                </p>

                                                <div className="space-y-3">
                                                    {skill.learningPlan.steps.map((step, stepIdx) => (
                                                        <div key={stepIdx} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-slate-200">
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold font-mono">
                                                                {stepIdx + 1}
                                                            </div>
                                                            <span className="text-sm font-medium text-slate-700">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="mt-4 flex justify-end">
                                                    <button
                                                        onClick={() => navigate('/career/learning-path')}
                                                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1"
                                                    >
                                                        Add to Full Roadmap <span>→</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </main>
            <FloatingChatbot />
        </div >
    );
};

export default SkillGapPage;
