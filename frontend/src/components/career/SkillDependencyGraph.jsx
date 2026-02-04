import React from 'react';
import { motion } from 'framer-motion';

const SkillDependencyGraph = ({ graphData }) => {
    if (!graphData || graphData.length === 0) return null;

    return (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-200 mb-12 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full opacity-50"></div>

            <div className="mb-8">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-indigo-600">⚡</span> Smart Learning Path
                </h3>
                <p className="text-slate-600 mt-2">
                    Understanding <strong>why</strong> you need to learn these skills in this order.
                </p>
            </div>

            <div className="relative">
                <div className="hidden md:block absolute left-4 top-4 bottom-4 w-0.5 bg-slate-100"></div>

                <div className="space-y-8">
                    {graphData.map((node, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.15 }}
                            className="relative flex flex-col md:flex-row gap-6"
                        >
                            {/* Timeline Node */}
                            <div className="hidden md:flex flex-col items-center">
                                <div className="w-8 h-8 rounded-full bg-indigo-100 border-4 border-white shadow-sm flex items-center justify-center z-10">
                                    <span className="text-xs font-bold text-indigo-700">{index + 1}</span>
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className="flex-1 bg-slate-50 rounded-xl p-5 border border-slate-200">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">

                                    {/* Skill & Unlocks */}
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-slate-800">{node.skill}</h4>
                                        <p className="text-sm text-slate-600 mt-1 mb-3">{node.reason}</p>

                                        {node.unlocks && node.unlocks.length > 0 && (
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
                                                    Unlocks:
                                                </span>
                                                <div className="flex flex-wrap gap-2">
                                                    {node.unlocks.map((unlocked, i) => (
                                                        <span key={i} className="text-xs text-emerald-700 font-medium">
                                                            {unlocked}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Topics & Resources */}
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                                            {node.topics && node.topics.length > 0 && (
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Topics to Cover</h5>
                                                    <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                                                        {node.topics.map((topic, i) => (
                                                            <li key={i}>{topic}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}

                                            {node.resources && node.resources.length > 0 && (
                                                <div>
                                                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Learning Resources</h5>
                                                    <div className="flex flex-col gap-2">
                                                        {node.resources.map((res, i) => (
                                                            <a
                                                                key={i}
                                                                href={res.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-sm text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1.5"
                                                            >
                                                                <span>📚</span> {res.name}
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Prerequisites */}
                                    {node.prerequisites && node.prerequisites.length > 0 && (
                                        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm md:w-64">
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Prerequisites</p>
                                            <div className="flex flex-wrap gap-2">
                                                {node.prerequisites.map((req, i) => (
                                                    <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded border border-slate-200">
                                                        {req}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SkillDependencyGraph;
