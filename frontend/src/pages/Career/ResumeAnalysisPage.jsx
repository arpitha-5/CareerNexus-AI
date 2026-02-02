import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar.jsx';
import FloatingChatbot from '../../components/ai/FloatingChatbot.jsx';
import ResumeAnalysisStep from '../../components/career/ResumeAnalysisStep.jsx';

function ResumeAnalysisPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />
      
      {/* Back Button */}
      <div className="bg-white border-b border-gray-300 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all"
            title="Back to Dashboard"
          >
            <span className="text-xl">←</span>
            Back
          </motion.button>
        </div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-12"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-6">
              <span className="text-4xl">📄</span>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Resume Analysis</h1>
            <p className="text-xl text-gray-600">Get detailed feedback on your resume for your target career</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-3xl border-2 border-gray-200 p-8 shadow-sm"
          >
            <ResumeAnalysisStep />
          </motion.div>
        </div>
      </motion.div>

      <FloatingChatbot />
    </div>
  );
}

export default ResumeAnalysisPage;
