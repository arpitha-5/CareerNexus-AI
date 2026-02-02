import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import FloatingChatbot from '../../components/ai/FloatingChatbot.jsx';
import { getCareerGuidance, analyzeJobRoleMatch, analyzeCareerRisk } from '../../api/aiApi.js';

const JobRoleMatchPage = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    const [matchData, setMatchData] = useState(null);
    const [error, setError] = useState(null);
    const [riskData, setRiskData] = useState(null);
    const [analyzingRisk, setAnalyzingRisk] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getCareerGuidance();
                if (response.data && response.data.success) {
                    const g = response.data.guidance;

                    // Transform API data to UI format
                    setMatchData({
                        primaryMatch: {
                            role: g.career,
                            matchScore: g.confidence,
                            salary: '$90k - $130k', // Dynamic estimation placeholder
                            demand: 'High',
                            fitReason: g.reason,
                            topSkills: g.priority_skills?.map(s => s.name) || [],
                            missingSkills: g.skill_gaps?.map(s => s.skill) || [],
                            description: g.readiness_explanation || 'A great role matching your profile.'
                        },
                        secondaryMatches: [
                            // Keep static for now as API returns single best match
                            {
                                role: 'DevOps Engineer',
                                matchScore: 75,
                                skills: ['Docker', 'CI/CD', 'Linux'],
                                reason: 'Good infrastructure skills, but needs more automation experience.'
                            },
                            {
                                role: 'Data Engineer',
                                matchScore: 65,
                                skills: ['SQL', 'Python', 'ETL'],
                                reason: 'Strong coding base, but needs specific data pipeline knowledge.'
                            }
                        ]
                    });
                } else {
                    throw new Error(response.data?.message || 'Failed to fetch career match');
                }
            } catch (err) {
                console.error("Career match error:", err);
                setError("Unable to load career analysis. Please try again.");
                // Fallback to mock data for demo robustness if fetch fails
                setMatchData({
                    primaryMatch: {
                        role: 'Full Stack Developer',
                        matchScore: 92,
                        salary: '$85k - $120k',
                        demand: 'Very High',
                        fitReason: 'Your combination of React, Node.js, and problem-solving skills aligns perfectly with this high-demand role.',
                        topSkills: ['React', 'Node.js', 'System Design'],
                        missingSkills: ['Docker', 'AWS'],
                        description: 'Build end-to-end web applications, designing both the front-end user experience and the back-end logic.'
                    },
                    secondaryMatches: []
                });
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRoleClick = async (role) => {
        setLoading(true);
        try {
            const response = await analyzeJobRoleMatch(role);
            if (response.data && response.data.success) {
                const g = response.data.guidance;
                setMatchData(prev => ({
                    ...prev,
                    primaryMatch: {
                        role: g.career,
                        matchScore: g.confidence,
                        salary: '$90k - $140k', // Estimate
                        demand: 'High',
                        fitReason: g.reason,
                        topSkills: g.priority_skills?.map(s => s.name) || [],
                        missingSkills: g.skill_gaps?.map(s => s.skill) || [],
                        description: g.readiness_explanation
                    }
                }));
                // Scroll to top to see new result
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Role analysis failed", err);
            alert("Could not analyze this role. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleRiskAnalysis = async () => {
        if (!matchData?.primaryMatch?.role) return;
        setAnalyzingRisk(true);
        try {
            const response = await analyzeCareerRisk(matchData.primaryMatch.role);
            if (response.data) {
                setRiskData(response.data);
            }
        } catch (err) {
            console.error("Risk analysis failed", err);
            // Fallback for demo
            setRiskData({
                summary: { stability_score: 82, risk_level: 'Low' },
                risk_breakdown: { layoff_risk: 'Low', automation_risk: 'Medium', competition_level: 'High' },
                ai_insight: 'This role is fundamental to tech infrastructure. While automation tools exist, they empower rather than replace this role.',
                risk_mitigation: ['Master Cloud Native tools', 'Focus on Security', 'Learn AI integration'],
                future_proofing_tip: 'Pivot towards Platform Engineering.'
            });
        } finally {
            setAnalyzingRisk(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
                    <h2 className="text-xl font-semibold text-slate-800 animate-pulse">Analyzing your profile...</h2>
                    <p className="text-slate-500 mt-2">Matching skills with 5,000+ job roles</p>
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
                    <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                        AI Career Intelligence
                    </span>
                    <h1 className="text-4xl font-bold text-slate-900 mt-4 mb-2">Job Role Match</h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Based on your skills, projects, and learning history, our AI has identified your best career fits.
                    </p>
                </motion.div>

                {/* Primary Match - Hero Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-12 relative"
                >
                    {/* Best Match Badge */}
                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-bl-xl shadow-sm z-10 flex items-center gap-1">
                        <span>★</span> Best Match
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2">
                        <div className="p-8 md:p-10 flex flex-col justify-center bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
                            <h2 className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-2">Recommended Role</h2>
                            <h3 className="text-4xl font-bold mb-4">{matchData.primaryMatch.role}</h3>
                            <p className="text-indigo-100 text-lg mb-8 leading-relaxed opacity-90">
                                {matchData.primaryMatch.description}
                            </p>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => navigate('/career/roadmap', { state: { role: matchData.primaryMatch.role } })}
                                    className="bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-lg font-bold shadow-lg transition-all transform hover:-translate-y-1"
                                >
                                    View Roadmap
                                </button>
                                <button
                                    onClick={() => navigate('/career/guidance')}
                                    className="bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 border border-white/20 text-white px-6 py-3 rounded-lg font-semibold backdrop-blur-sm transition-all"
                                >
                                    Full Analysis
                                </button>
                            </div>
                        </div>

                        <div className="p-8 md:p-10 bg-white">
                            <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                                <div>
                                    <p className="text-slate-500 text-sm font-medium mb-1">Match Score</p>
                                    <p className="text-4xl font-bold text-green-600">{matchData.primaryMatch.matchScore}%</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-slate-500 text-sm font-medium mb-1">Market Demand</p>
                                    <p className="text-xl font-bold text-slate-800">{matchData.primaryMatch.demand}</p>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h4 className="text-slate-800 font-bold mb-3 flex items-center gap-2">
                                    <span className="text-indigo-600">Why it fits</span>
                                </h4>
                                <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                                    {matchData.primaryMatch.fitReason}
                                </p>
                            </div>

                            <div>
                                <h4 className="text-slate-800 font-bold mb-3">Top Matching Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {matchData.primaryMatch.topSkills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-green-50 text-green-700 text-sm font-semibold rounded-full border border-green-100">


                                            {skill}
                                        </span>
                                    ))}
                                    {matchData.primaryMatch.missingSkills.map((skill, idx) => (
                                        <span key={idx} className="px-3 py-1 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full border border-orange-100 opacity-75">
                                            ! {skill} (Gap)
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Risk & Stability Analysis Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-12"
                >
                    {!riskData ? (
                        <div className="flex justify-center">
                            <button
                                onClick={handleRiskAnalysis}
                                disabled={analyzingRisk}
                                className="bg-slate-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-700 transition-all flex items-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-75 disabled:cursor-not-allowed"
                            >
                                {analyzingRisk ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        Analyzing Market Stability...
                                    </>
                                ) : (
                                    <>
                                        <span className="text-xl">📊</span> Analyze Long-Term Career Stability
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            <div className="bg-slate-900 p-6 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                    <span className="text-indigo-400">🛡️</span> Career Risk & Stability Analysis
                                </h3>
                                <div className={`px-4 py-1 rounded-full text-sm font-bold ${riskData.summary.risk_level === 'Low' ? 'bg-green-500/20 text-green-400' :
                                        riskData.summary.risk_level === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                    }`}>
                                    {riskData.summary.risk_level} Risk
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                                    {/* Stability Score */}
                                    <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100">
                                        <div className="text-slate-500 font-medium mb-2">Stability Score</div>
                                        <div className="text-5xl font-black text-slate-800 mb-2">{riskData.summary.stability_score}/100</div>
                                        <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-600" style={{ width: `${riskData.summary.stability_score}%` }}></div>
                                        </div>
                                    </div>

                                    {/* Risk Breakdown */}
                                    <div className="col-span-2 grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Layoff Risk', val: riskData.risk_breakdown.layoff_risk },
                                            { label: 'Automation', val: riskData.risk_breakdown.automation_risk },
                                            { label: 'Competition', val: riskData.risk_breakdown.competition_level }
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 bg-white border border-slate-100 rounded-xl flex flex-col items-center justify-center text-center shadow-sm">
                                                <div className="text-sm text-slate-400 font-medium mb-1">{item.label}</div>
                                                <div className={`text-lg font-bold ${item.val === 'Low' ? 'text-green-600' :
                                                        item.val === 'Medium' ? 'text-yellow-600' : 'text-red-500'
                                                    }`}>
                                                    {item.val}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3">🤖 AI Insight</h4>
                                        <p className="text-slate-600 leading-relaxed bg-indigo-50/50 p-4 rounded-lg border border-indigo-100">
                                            {riskData.ai_insight}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800 mb-3">🛡️ Future Proofing</h4>
                                        <div className="bg-emerald-50/50 p-4 rounded-lg border border-emerald-100 text-emerald-800 font-medium">
                                            💡 {riskData.future_proofing_tip}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-slate-100">
                                    <h4 className="font-bold text-slate-800 mb-4">Risk Mitigation Strategy</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {riskData.risk_mitigation.map((tip, idx) => (
                                            <div key={idx} className="flex items-start gap-3 text-slate-600 text-sm">
                                                <span className="text-green-500 font-bold">✓</span>
                                                {tip}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>

                {/* Secondary Matches */}
                <div className="mb-12">
                    <h3 className="text-2xl font-bold text-slate-900 mb-6">Other Strong Candidates</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {matchData.secondaryMatches.map((job, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (idx * 0.1) }}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-indigo-200 transition-all cursor-pointer group"
                                onClick={() => handleRoleClick(job.role)}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{job.role}</h4>
                                        <p className="text-sm text-slate-500 mt-1">{job.matchScore}% Match Rate</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                        ➜
                                    </div>
                                </div>

                                <div className="w-full bg-slate-100 h-2 rounded-full mb-4 overflow-hidden">
                                    <div
                                        className="h-full bg-slate-400 group-hover:bg-indigo-500 transition-colors"
                                        style={{ width: `${job.matchScore}%` }}
                                    ></div>
                                </div>

                                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{job.reason}</p>

                                <div className="flex flex-wrap gap-2">
                                    {job.skills.map((skill, sIdx) => (
                                        <span key={sIdx} className="text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 md:p-12 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to land your dream role?</h3>
                        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                            Bridge your skill gaps with a personalized AI-generated learning path and get interview ready in weeks.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => navigate('/career/interview')}
                                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all"
                            >
                                Start Interview Prep
                            </button>
                            <button
                                onClick={() => navigate('/ai/resume-upload')}
                                className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-3 rounded-lg font-bold backdrop-blur-sm transition-all"
                            >
                                Analyze Resume
                            </button>
                        </div>
                    </div>
                </div>

            </main>
            <FloatingChatbot />
        </div>
    );
};

export default JobRoleMatchPage;
