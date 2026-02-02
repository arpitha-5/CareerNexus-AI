import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateInterviewPrep } from '../../api/careerGuidanceApi.js';

const InterviewPrepStep = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [expandedQ, setExpandedQ] = useState(null);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const response = await generateInterviewPrep();
        setResult(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to generate interview prep');
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, []);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white text-center"
      >
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <h2 className="text-2xl font-bold">Generating Interview Questions...</h2>
        <p className="text-gray-300 mt-2">AI is crafting personalized questions for you</p>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white"
      >
        <h2 className="text-2xl font-bold mb-4">❌ Error</h2>
        <p className="text-red-300 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="w-full bg-gradient-to-r from-red-500 to-pink-500 font-bold py-3 rounded-lg"
        >
          Retry
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white"
    >
      <h2 className="text-3xl font-bold mb-2">🎤 Step 3: Interview Preparation</h2>
      <p className="text-gray-300 mb-8">Practice these role-specific questions and master your interview</p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        {/* Practice Tips */}
        {result?.practiceTips?.length > 0 && (
          <div className="bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20 rounded-lg p-6">
            <h4 className="font-semibold mb-3 text-pink-300">💬 Interview Tips</h4>
            <ul className="space-y-2">
              {result.practiceTips.map((tip, idx) => (
                <li key={idx} className="flex gap-3 text-gray-200">
                  <span className="text-pink-400">✦</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Interview Questions */}
        <div>
          <h4 className="font-semibold mb-4 text-blue-300">📝 Interview Questions</h4>
          <div className="space-y-3">
            {result?.questions?.map((q, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="border border-white/20 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => setExpandedQ(expandedQ === idx ? null : idx)}
                  className="w-full bg-white/10 hover:bg-white/20 transition-colors px-6 py-4 text-left font-semibold text-blue-300 flex items-center justify-between"
                >
                  <span className="flex items-center gap-3">
                    <span className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </span>
                    {q.question}
                  </span>
                  <span className="text-xl">{expandedQ === idx ? '▼' : '▶'}</span>
                </button>

                {expandedQ === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white/5 border-t border-white/20 px-6 py-4 space-y-4"
                  >
                    <div>
                      <h5 className="text-green-300 font-semibold mb-2">📌 Sample Answer:</h5>
                      <p className="text-gray-200 leading-relaxed">{q.sampleAnswer}</p>
                    </div>

                    {q.tips?.length > 0 && (
                      <div>
                        <h5 className="text-yellow-300 font-semibold mb-2">💡 Tips:</h5>
                        <ul className="space-y-1">
                          {q.tips.map((tip, tidx) => (
                            <li key={tidx} className="text-gray-200 flex gap-2">
                              <span className="text-yellow-400">•</span>
                              <span>{tip}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <button
          onClick={onComplete}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold py-3 rounded-lg text-white transition-all"
        >
          ✓ Continue to Next Step →
        </button>
      </motion.div>
    </motion.div>
  );
};

export default InterviewPrepStep;
