import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';

const RoleComparisonPage = () => {
    const { token } = useAuth();
    const [roleA, setRoleA] = useState('');
    const [roleB, setRoleB] = useState('');
    const [loading, setLoading] = useState(false);
    const [comparisonData, setComparisonData] = useState(null);

    const handleCompare = async (e) => {
        e.preventDefault();
        if (!roleA || !roleB) return;
        setLoading(true);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}/ai/compare-roles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({ roleA, roleB })
            });
            const data = await res.json();
            setComparisonData(data);
        } catch (err) {
            console.error(err);
            alert('Failed to compare roles');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 pt-28 pb-10">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                        Role Comparison Engine
                    </h1>
                    <p className="text-slate-400">Compare two career paths to see which one fits you better.</p>
                </div>

                {/* INPUTS */}
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 max-w-3xl mx-auto mb-12">
                    <form onSubmit={handleCompare} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="flex-1 w-full">
                            <label className="block text-sm text-slate-400 mb-1">Role A</label>
                            <input
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="e.g. Frontend Developer"
                                value={roleA}
                                onChange={e => setRoleA(e.target.value)}
                                required
                            />
                        </div>
                        <div className="hidden md:flex pb-4 text-slate-500 font-bold">VS</div>
                        <div className="flex-1 w-full">
                            <label className="block text-sm text-slate-400 mb-1">Role B</label>
                            <input
                                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-purple-500 outline-none"
                                placeholder="e.g. Data Scientist"
                                value={roleB}
                                onChange={e => setRoleB(e.target.value)}
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-lg font-bold transition disabled:opacity-50"
                        >
                            {loading ? 'Analyzing...' : 'Compare'}
                        </button>
                    </form>
                </div>

                {/* RESULTS */}
                {comparisonData && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        {/* Recommendation Banner */}
                        <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 p-6 rounded-xl mb-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>

                            <div className="relative z-10 text-center">
                                <span className="bg-indigo-500/20 text-indigo-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-500/30">
                                    AI Strategic Verdict
                                </span>
                                <h2 className="text-3xl font-bold text-white mt-4 mb-2">
                                    {comparisonData.verdict?.role ? `Winner: ${comparisonData.verdict.role}` : "Analysis Complete"}
                                </h2>
                                <p className="text-lg text-slate-200 font-medium mb-4">
                                    {comparisonData.verdict?.short_reason}
                                </p>

                                {comparisonData.verdict?.trade_off && (
                                    <div className="bg-slate-900/40 p-3 rounded-lg border border-slate-700/50 inline-block max-w-2xl">
                                        <p className="text-sm text-slate-400 italic">
                                            <span className="text-amber-400 font-bold not-italic">⚠️ The Trade-off: </span>
                                            {comparisonData.verdict.trade_off}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Comparison Table */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {comparisonData.comparison?.map((item, idx) => (
                                <div key={idx} className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl border border-slate-700 flex flex-col hover:border-slate-600 transition-all">
                                    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 text-center border-b border-slate-700/50 pb-3">
                                        {item.criteria}
                                    </h3>

                                    <div className="flex justify-between items-center mb-5 flex-1">
                                        <div className={`text-center flex-1 ${item.winner === 'Role A' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 opacity-80'} transition-all`}>
                                            <div className="text-[10px] uppercase text-slate-500 mb-1 font-bold">{roleA}</div>
                                            <div className="text-sm leading-tight">{item.roleA_val}</div>
                                        </div>

                                        <div className="w-px h-12 bg-slate-700 mx-3"></div>

                                        <div className={`text-center flex-1 ${item.winner === 'Role B' ? 'text-emerald-400 font-bold scale-105' : 'text-slate-400 opacity-80'} transition-all`}>
                                            <div className="text-[10px] uppercase text-slate-500 mb-1 font-bold">{roleB}</div>
                                            <div className="text-sm leading-tight">{item.roleB_val}</div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                                            <p className="text-xs text-slate-400 text-center leading-relaxed">
                                                {item.insight}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default RoleComparisonPage;
