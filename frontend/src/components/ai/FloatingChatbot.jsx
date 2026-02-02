import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChatbotWindow from './ChatbotWindow.jsx';

const FloatingChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleChat = () => {
    if (isOpen) {
      setIsOpen(false);
      setIsExpanded(false);
    } else {
      setIsOpen(true);
      setIsExpanded(false);
    }
  };

  const toggleExpand = (e) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
      {/* Compact Preview or Full Chatbot Window */}
      <AnimatePresence mode="wait">
        {isOpen && !isExpanded && (
          <motion.div
            key="compact"
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-20 right-0 mb-2 w-72 rounded-xl border border-slate-200 bg-white shadow-lg overflow-hidden"
          >
            {/* Compact Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 px-4 py-3 text-white">
              <div className="flex items-center gap-2 flex-1">
                <div className="h-7 w-7 rounded-full bg-white/20 flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-sm">CareerNexus AI</h3>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={toggleExpand}
                  className="h-6 w-6 rounded hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Expand chatbot"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                </button>
                <button
                  onClick={toggleChat}
                  className="h-6 w-6 rounded hover:bg-white/20 flex items-center justify-center transition-colors"
                  aria-label="Close chatbot"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Compact Message Preview */}
            <div className="p-3 text-sm text-gray-600 bg-gray-50 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-1">Ready to help! Click expand to chat.</p>
            </div>
          </motion.div>
        )}

        {isOpen && isExpanded && (
          <div className="absolute bottom-20 right-0 mb-2">
            <ChatbotWindow onClose={toggleChat} onCollapse={toggleExpand} />
          </div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group relative overflow-hidden"
        aria-label="Toggle chatbot"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-purple-700 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Icon */}
        <div className="relative z-10">
          <motion.svg
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </motion.svg>
        </div>

        {/* Notification badge */}
        {!isOpen && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 border-2 border-white"
          />
        )}

        {/* Pulse animation ring */}
        {!isOpen && (
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 via-purple-600 to-orange-500"
          />
        )}
      </motion.button>

      {/* Tooltip */}
      {!isOpen && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-20 right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap shadow-lg pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
        >
          Chat with AI Assistant
          <div className="absolute top-full right-6 -mt-1 border-4 border-transparent border-t-gray-900"></div>
        </motion.div>
      )}
    </div>
  );
};

export default FloatingChatbot;
