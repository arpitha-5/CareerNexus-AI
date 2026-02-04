import React from 'react';
import { motion } from 'framer-motion';

const RecruiterSignalCard = ({ signalData }) => {
    if (!signalData) return null;

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-emerald-500';
        if (score >= 60) return 'text-amber-500';
        return 'text-red-500';
    };

    const getProgressColor = (score) => {
        if (score >= 80) return 'bg-emerald-500';
        if (score >= 60) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getProbabilityLabel = (score) => {
        if (score >= 80) return 'Very High';
        if (score >= 60) return 'Good';
        if (score >= 40) return 'Moderate';
        return 'Low';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-700 text-slate-200 mb-8 overflow-hidden relative"
        >
            {/* Background Decorative Elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/10 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
                                🎯 Recruiter Simulation
                            </span>
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-1">Hiring Signal Evaluation</h3>
                        <p className="text-slate-400 text-sm">
                            How a senior technical recruiter views your profile right now.
                        </p>
                    </div>

                    {/* Interview Probability & Verdict */}
                    <div className="flex flex-col items-end gap-3">
                        {/* Verdict Badge */}
                        {signalData.verdict && (
                            <div className={`px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest shadow-lg ${signalData.verdict === 'Shortlisted' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50' :
                                    signalData.verdict === 'Borderline' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50' :
                                        'bg-red-500/20 text-red-300 border-red-500/50'
                                }`}>
                                Verdict: {signalData.verdict}
                            </div>
                        )}

                        <div className="flex items-center gap-4 bg-slate-800/70 backdrop-blur-sm p-4 rounded-xl border border-slate-700/50 shadow-lg">
                            <div className="text-right">
                                <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Interview Callback</p>
                                <p className={`text-3xl font-bold ${getScoreColor(signalData.interviewProbability)}`}>
                                    {signalData.interviewProbability}%
                                </p>
                                <p className="text-[10px] text-slate-500 mt-1">{getProbabilityLabel(signalData.interviewProbability)} Chance</p>
                            </div>
                            <div className="w-14 h-14 rounded-full border-4 border-slate-700 flex items-center justify-center relative">
                                <svg className="w-full h-full transform -rotate-90 absolute top-0 left-0">
                                    <circle cx="26" cy="26" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-slate-800" />
                                    <circle cx="26" cy="26" r="22" stroke="currentColor" strokeWidth="4" fill="transparent"
                                        strokeDasharray={138}
                                        strokeDashoffset={138 - (138 * signalData.interviewProbability) / 100}
                                        className={`${getScoreColor(signalData.interviewProbability).replace('text-', 'stroke-')} transition-all duration-1000 ease-out`}
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {[
                        { label: 'Resume Strength', value: signalData.resumeSignalStrength, desc: 'ATS readability & clarity', icon: '📄' },
                        { label: 'Skill Match', value: signalData.skillMatchScore, desc: 'Core requirements fit', icon: '⚡' },
                        { label: 'Project Relevance', value: signalData.projectRelevanceScore, desc: 'Depth vs buzzwords', icon: '🚀' }
                    ].map((metric, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-5 border border-slate-700 hover:border-slate-600 transition-all"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{metric.icon}</span>
                                    <span className="text-sm font-semibold text-slate-300">{metric.label}</span>
                                </div>
                                <span className={`text-xl font-bold ${getScoreColor(metric.value)}`}>{metric.value}</span>
                            </div>
                            <div className="h-2.5 w-full bg-slate-700 rounded-full overflow-hidden mb-2">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${metric.value}%` }}
                                    transition={{ duration: 1, delay: 0.2 * i }}
                                    className={`h-full ${getProgressColor(metric.value)} rounded-full`}
                                ></motion.div>
                            </div>
                            <p className="text-[10px] text-slate-500">{metric.desc}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recruiter Insight */}
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/10 border border-indigo-500/30 rounded-xl p-6 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="text-2xl">💼</span>
                            <h4 className="text-sm font-bold text-indigo-300 uppercase tracking-wide">Recruiter's Honest Take</h4>
                        </div>
                        <p className="text-slate-200 text-sm leading-relaxed">
                            "{signalData.recruiterInsight || 'No specific insights available.'}"
                        </p>
                    </div>
                </div>

                {/* Strengths & Weaknesses Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Strengths */}
                    {signalData.strengths && signalData.strengths.length > 0 && (
                        <div className="bg-emerald-900/10 border border-emerald-500/20 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">✅</span>
                                <h4 className="text-sm font-bold text-emerald-300 uppercase tracking-wide">What Helps You</h4>
                            </div>
                            <ul className="space-y-2">
                                {signalData.strengths.map((strength, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-emerald-400 mt-0.5">•</span>
                                        <span>{strength}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Weaknesses */}
                    {signalData.weaknesses && signalData.weaknesses.length > 0 && (
                        <div className="bg-red-900/10 border border-red-500/20 rounded-xl p-5">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">⚠️</span>
                                <h4 className="text-sm font-bold text-red-300 uppercase tracking-wide">What Hurts You</h4>
                            </div>
                            <ul className="space-y-2">
                                {signalData.weaknesses.map((weakness, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm text-slate-300">
                                        <span className="text-red-400 mt-0.5">•</span>
                                        <span>{weakness}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Improvement Actions */}
                {signalData.improvementActions && signalData.improvementActions.length > 0 && (
                    <div className="bg-gradient-to-br from-amber-900/10 to-orange-900/10 border border-amber-500/30 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">🎯</span>
                            <h4 className="text-sm font-bold text-amber-300 uppercase tracking-wide">Fix This First (Prioritized)</h4>
                        </div>
                        <div className="space-y-3">
                            {signalData.improvementActions.map((action, idx) => (
                                <div key={idx} className="flex items-start gap-3 bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold border border-amber-500/30">
                                        {idx + 1}
                                    </div>
                                    <p className="text-sm text-slate-200 leading-relaxed">{action}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </motion.div>
    );
};

export default RecruiterSignalCard;
