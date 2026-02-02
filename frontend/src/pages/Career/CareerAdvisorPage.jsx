import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import FloatingChatbot from '../../components/ai/FloatingChatbot.jsx';

const CareerAdvisorPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    // Mock Advisor Data
    const advisorData = {
        studentName: "Future Engineer",
        matchedRole: "Full Stack Developer",
        strengths: [
            "Your project portfolio demonstrates strong practical application of React.",
            "You have a good grasp of algorithmic thinking based on your assessment scores."
        ],
        weaknesses: [
            "Lack of cloud deployment experience (AWS/Azure) might limit job options.",
            "System design knowledge is theoretical and needs more practice."
        ],
        advice: [
            { type: "Immediate", text: "Build one complex project deployed on AWS to showcase DevOps skills." },
            { type: "Networking", text: "Join 2 hackathons this month to build your network and soft skills." },
            { type: "Learning", text: "Focus on System Design patterns (Microservices) for the next 2 weeks." }
        ],
        quote: "The best way to predict the future is to create it."
    };

    useEffect(() => {
        // Simulate AI Thinking delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="relative w-20 h-20 mb-4">
                        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
                        <div className="relative bg-white rounded-full w-20 h-20 border-2 border-indigo-100 flex items-center justify-center text-3xl shadow-sm">
                            🤖
                        </div>
                    </div>
                    <h2 className="text-xl font-semibold text-slate-800 animate-pulse">Consulting AI Mentor...</h2>
                    <p className="text-slate-500 mt-2">Synthesizing personalized career strategy</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <Navbar />

            <main className="flex-1 max-w-5xl mx-auto px-6 py-10 w-full">
                {/* Header with Persona */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex flex-col md:flex-row items-center gap-6 bg-white p-8 rounded-3xl shadow-lg border border-indigo-50"
                >
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-4xl shadow-md border-4 border-white">
                        🤖
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">CareerNexus Advisor</h1>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            "Hello, <span className="font-semibold text-indigo-600">{advisorData.studentName}</span>.
                            I've analyzed your profile. You have excellent potential as a <span className="font-semibold text-indigo-600">{advisorData.matchedRole}</span>.
                            Here is my honest feedback."
                        </p>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                    {/* Strengths */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-green-500"></div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="text-green-500">✓</span> Your Strengths
                        </h3>
                        <ul className="space-y-4">
                            {advisorData.strengths.map((str, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-green-400 flex-shrink-0"></span>
                                    <p className="text-slate-600">{str}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Weaknesses/Risks */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                            <span className="text-orange-500">⚠️</span> Areas to Watch
                        </h3>
                        <ul className="space-y-4">
                            {advisorData.weaknesses.map((weak, idx) => (
                                <li key={idx} className="flex items-start gap-3">
                                    <span className="mt-1 w-2 h-2 rounded-full bg-orange-400 flex-shrink-0"></span>
                                    <p className="text-slate-600">{weak}</p>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Actionable Advice - "The Plan" */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-slate-900 rounded-3xl p-8 md:p-10 text-white shadow-2xl relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h3 className="text-2xl font-bold mb-8 relative z-10">My Actionable Advice For You</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {advisorData.advice.map((item, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
                                <span className="text-indigo-300 text-xs font-bold uppercase tracking-wider block mb-3">{item.type}</span>
                                <p className="text-slate-200 font-medium leading-relaxed">
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10 text-center">
                        <p className="text-slate-400 italic font-serif text-lg">"{advisorData.quote}"</p>
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <div className="flex justify-center gap-4 mt-12">
                    <button
                        onClick={() => navigate('/career/learning-path')}
                        className="px-6 py-3 bg-white text-slate-700 font-semibold rounded-lg shadow-sm border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all"
                    >
                        Go to Learning Path
                    </button>
                    <button
                        onClick={() => navigate('/career/match')}
                        className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-all"
                    >
                        View Job Matches
                    </button>
                </div>

            </main>
            <FloatingChatbot />
        </div>
    );
};

export default CareerAdvisorPage;
