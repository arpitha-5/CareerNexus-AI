import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/common/Navbar.jsx';
import FloatingChatbot from '../../components/ai/FloatingChatbot.jsx';
import { generateLearningRoadmap } from '../../api/careerGuidanceApi.js';
import { useAuth } from '../../context/AuthContext.jsx';

const LearningPathPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [learningData, setLearningData] = useState(null);
    const [error, setError] = useState(null);

    // Dedicated fallback data in case of API failure or first-time load issue
    const fallbackPathData = {
        role: "Full Stack Developer",
        currentLevel: "Intermediate",
        totalTime: "12 Weeks",
        weeklyCommitment: "15 hours/week",
        phases: [
            {
                phase: 1,
                title: "Foundation Reinforcement",
                duration: "Weeks 1-4",
                goal: "Solidify core concepts and fill critical gaps in DevOps.",
                skills: [
                    { name: "Docker Fundamentals", type: "Gap", time: "10h", status: "Pending" },
                    { name: "Advanced JavaScript Patterns", type: "Core", time: "8h", status: "Completed" },
                    { name: "CSS Grid/Flexbox Mastery", type: "Core", time: "5h", status: "Completed" }
                ],
                outcome: "Ability to containerize applications and write clean, modular frontend code."
            },
            {
                phase: 2,
                title: "Advanced System Architecture",
                duration: "Weeks 5-8",
                goal: "Master backend scalability and API design.",
                skills: [
                    { name: "GraphQL API Design", type: "Gap", time: "12h", status: "Pending" },
                    { name: "System Design Patterns", type: "Gap", time: "15h", status: "Pending" },
                    { name: "Database Indexing & Optimization", type: "Core", time: "8h", status: "In Progress" }
                ],
                outcome: "Design scalable backend systems capable of handling high traffic."
            },
            {
                phase: 3,
                title: "Professional Projects & Interview Prep",
                duration: "Weeks 9-12",
                goal: "Build portfolio-worthy projects and prepare for technical screenings.",
                skills: [
                    { name: "Microservices Project (End-to-End)", type: "Project", time: "20h", status: "Pending" },
                    { name: "LeetCode Patterns (Medium/Hard)", type: "Interview", time: "15h", status: "Pending" },
                    { name: "Mock Interviews", type: "Interview", time: "5h", status: "Pending" }
                ],
                outcome: "Job-ready portfolio and confidence to crack Tier-1 tech interviews."
            }
        ]
    };



    useEffect(() => {
        const fetchPath = async () => {
            try {
                setLoading(true);
                // Try to fetch dynamic data
                const response = await generateLearningRoadmap();

                if (response.data && response.data.data) {
                    setLearningData(response.data.data);
                } else if (response.data) {
                    setLearningData(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch learning path:", err);
                setError("Using fallback path due to connection issue.");
                // We will gracefully fall back to 'fallbackPathData'
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPath();
        } else {
            // If no user, maybe redirect or just stop loading (auth context handles redirect usually)
            setLoading(false);
        }
    }, [user]);

    // Use dynamic data if available, otherwise fallback
    const pathData = learningData?.phases ? learningData : fallbackPathData;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-indigo-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-indigo-600 rounded-full border-t-transparent animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl">🧠</div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800 animate-pulse">Generating Personal Curriculum...</h2>
                    <p className="text-slate-500 mt-2">Aligning specific skill gaps with market requirements</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto px-6 py-12 w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex items-center gap-3 mb-4">
                        <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                            Personalized For You
                        </span>
                        <span className="text-slate-400 text-sm font-semibold">
                            Based on your profile & skill gaps
                        </span>
                        {error && (
                            <span className="text-orange-500 text-xs font-semibold ml-2">
                                (Offline Mode)
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-extrabold text-slate-900 mb-4 leading-tight">
                        Your Path to <span className="text-indigo-600">{pathData.role}</span>
                    </h1>
                    <div className="flex flex-wrap gap-6 text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                            <span className="text-lg">⏱️</span> {pathData.totalTime}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">🔥</span> {pathData.weeklyCommitment}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-lg">📈</span> Current Level: {pathData.currentLevel}
                        </div>
                    </div>


                    {pathData.whyThisPath && (
                        <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <h4 className="text-indigo-900 font-bold mb-1 flex items-center gap-2">
                                🤖 AI Insight
                            </h4>
                            <p className="text-indigo-800 text-sm italic">
                                "{pathData.whyThisPath}"
                            </p>
                        </div>
                    )}
                </motion.div>

                {/* Timeline / Phases */}
                <div className="space-y-8 relative">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-[28px] top-8 bottom-8 w-0.5 bg-slate-200 hidden md:block"></div>

                    {pathData.phases.map((phase, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 + (index * 0.1) }}
                            className="relative md:pl-20 group"
                        >
                            {/* Phase Circle */}
                            <div className="absolute left-0 top-0 w-14 h-14 bg-white border-4 border-indigo-50 rounded-full flex items-center justify-center shadow-sm z-10 hidden md:flex group-hover:border-indigo-500 group-hover:scale-110 transition-all duration-300">
                                <span className="text-xl font-black text-indigo-600">{phase.phase}</span>
                            </div>

                            {/* Phase Content Card */}
                            <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                                    <div>
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block">
                                            {phase.duration}
                                        </span>
                                        <h3 className="text-2xl font-bold text-slate-900">{phase.title}</h3>
                                        <p className="text-slate-600 mt-2 text-sm">{phase.goal}</p>
                                    </div>
                                    <div className="bg-indigo-50 px-4 py-2 rounded-lg border border-indigo-100 self-start">
                                        <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider block mb-1">Target Outcome</span>
                                        <p className="text-indigo-900 text-sm font-semibold">{phase.outcome}</p>
                                    </div>
                                </div>

                                {/* Skills Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {phase.skills.map((skill, sIdx) => (
                                        <div key={sIdx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                {skill.status === "Completed" ? (
                                                    <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                                                ) : skill.type === "Gap" ? (
                                                    <div className="w-5 h-5 rounded-full bg-orange-100 border-2 border-orange-500"></div>
                                                ) : (
                                                    <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>
                                                )}

                                                <div>
                                                    <p className="font-semibold text-slate-800 text-sm">{skill.name}</p>
                                                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${skill.type === 'Gap' ? 'bg-orange-100 text-orange-700' :
                                                        skill.type === 'Project' ? 'bg-purple-100 text-purple-700' :
                                                            skill.type === 'Interview' ? 'bg-blue-100 text-blue-700' :
                                                                'bg-slate-200 text-slate-600'
                                                        }`}>
                                                        {skill.type}
                                                    </span>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-slate-400">{skill.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="bg-slate-900 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:bg-indigo-600 hover:shadow-xl transition-all active:scale-95">
                        Save This Learning Plan
                    </button>
                    <p className="text-slate-400 text-sm mt-4">Synced with your profile for real-time progress tracking.</p>
                </div>

            </main>
            <FloatingChatbot />
        </div>
    );
};

export default LearningPathPage;
