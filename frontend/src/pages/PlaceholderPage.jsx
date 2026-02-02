import React from 'react';
import Navbar from '../components/common/Navbar.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PlaceholderPage = ({ title = "Coming Soon", description = "This feature is currently under development. Stay tuned!" }) => {
  const { theme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen theme-bg" data-theme={theme}>
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="theme-card p-12 border border-dashed border-indigo-500/30 rounded-3xl"
        >
          <div className="text-6xl mb-6">🚧</div>
          <h1 className="text-4xl font-bold text-indigo-400 mb-4 font-display">
            {title}
          </h1>
          <p className="text-xl theme-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            {description}
          </p>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Return to Dashboard
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default PlaceholderPage;
