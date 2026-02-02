import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateLearningRoadmap, generateCareerReport } from '../../api/careerGuidanceApi.js';

const LearningRoadmapStep = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const generate = async () => {
      setLoading(true);
      try {
        const response = await generateLearningRoadmap();
        setResult(response.data.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to generate roadmap');
      } finally {
        setLoading(false);
      }
    };
    generate();
  }, []);

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    try {
      const response = await generateCareerReport();
      // Could download or display report here
      alert('✅ Career report generated successfully!');
      onComplete();
    } catch (err) {
      alert('❌ Failed to generate report: ' + (err.response?.data?.error || err.message));
    } finally {
      setGeneratingReport(false);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white text-center"
      >
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent mb-4"></div>
        <h2 className="text-2xl font-bold">Creating Your Roadmap...</h2>
        <p className="text-gray-300 mt-2">Personalizing your learning journey</p>
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
      <h2 className="text-3xl font-bold mb-2">🗺️ Step 4: Your Learning Roadmap</h2>
      <p className="text-gray-300 mb-8">A personalized timeline to master your career path</p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-8"
      >
        {/* Timeline Duration */}
        {result?.estimatedCompletionTime && (
          <div className="bg-gradient-to-r from-yellow-500/30 to-orange-500/30 border border-white/20 rounded-lg p-6">
            <h4 className="font-semibold mb-2 text-yellow-300">⏱️ Estimated Timeline</h4>
            <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
              {result.estimatedCompletionTime}
            </p>
          </div>
        )}

        {/* Short-term Roadmap */}
        {result?.shortTerm && (
          <div className="border border-white/20 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
              <h4 className="font-bold text-white text-lg">📌 Phase 1: Short-term ({result.shortTerm.duration})</h4>
            </div>
            <div className="bg-white/5 p-6 space-y-4">
              {result.shortTerm.topics?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-blue-300 mb-3">Topics to Master:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.shortTerm.topics.map((topic, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/10 border border-blue-500/30 rounded px-4 py-2 text-blue-200"
                      >
                        ✓ {topic}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {result.shortTerm.resources?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-cyan-300 mb-3">Recommended Resources:</h5>
                  <ul className="space-y-2">
                    {result.shortTerm.resources.map((resource, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-200">
                        <span className="text-cyan-400">📚</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Medium-term Roadmap */}
        {result?.mediumTerm && (
          <div className="border border-white/20 rounded-lg overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
              <h4 className="font-bold text-white text-lg">🚀 Phase 2: Medium-term ({result.mediumTerm.duration})</h4>
            </div>
            <div className="bg-white/5 p-6 space-y-4">
              {result.mediumTerm.topics?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-purple-300 mb-3">Topics to Master:</h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {result.mediumTerm.topics.map((topic, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-white/10 border border-purple-500/30 rounded px-4 py-2 text-purple-200"
                      >
                        ✓ {topic}
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {result.mediumTerm.resources?.length > 0 && (
                <div>
                  <h5 className="font-semibold text-pink-300 mb-3">Recommended Resources:</h5>
                  <ul className="space-y-2">
                    {result.mediumTerm.resources.map((resource, idx) => (
                      <li key={idx} className="flex gap-2 text-gray-200">
                        <span className="text-pink-400">📚</span>
                        <span>{resource}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Success Message */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="bg-gradient-to-r from-green-500/30 to-emerald-500/30 border border-green-500/50 rounded-lg p-6 text-center"
        >
          <h4 className="text-2xl font-bold text-green-300 mb-2">🎉 All Set!</h4>
          <p className="text-gray-200">Your personalized career journey is complete. Now let's generate your comprehensive career report.</p>
        </motion.div>

        <button
          onClick={handleGenerateReport}
          disabled={generatingReport}
          className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 disabled:opacity-50 font-bold py-3 rounded-lg text-white transition-all flex items-center justify-center gap-2"
        >
          {generatingReport ? (
            <>
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Generating Report...
            </>
          ) : (
            <>📥 Generate Final Career Report</>
          )}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default LearningRoadmapStep;
