import React, { useState, useEffect, useRef } from 'react';
import { chatbotMessage } from '../../api/aiApi.js';
import { motion, AnimatePresence } from 'framer-motion';

const ChatbotWindow = ({ onClose, onCollapse }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const send = async () => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', content: text, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setText('');
    setLoading(true);
    setError(null);
    
    try {
      const { data } = await chatbotMessage(userMsg.content);
      const botMsg = { role: 'assistant', content: data.reply, timestamp: new Date() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      setError('Failed to get response. Please try again.');
      const errorMsg = { 
        role: 'assistant', 
        content: 'Sorry, I\'m having trouble connecting right now. Please try again in a moment.', 
        timestamp: new Date(),
        isError: true 
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.15 }}
      className="flex h-[420px] w-[340px] flex-col rounded-2xl border border-slate-200 bg-white shadow-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 via-purple-600 to-orange-500 px-4 py-3 text-white shrink-0">
        <div className="flex items-center gap-2 flex-1">
          <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm leading-tight">CareerNexus AI</h3>
            <p className="text-xs text-white/80">Your AI Assistant</p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {onCollapse && (
            <button
              onClick={onCollapse}
              className="h-7 w-7 rounded hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Collapse chatbot"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
          <button
            onClick={onClose}
            className="h-7 w-7 rounded hover:bg-white/20 flex items-center justify-center transition-colors"
            aria-label="Close chatbot"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages Area - Compact with internal scrolling */}
      <div className="flex-1 space-y-3 overflow-y-auto p-3 bg-gray-50 custom-scrollbar">
        {messages.length === 0 && (
          <div className="text-center py-6 px-2">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 font-medium leading-tight">Hi! I'm your CareerNexus AI</p>
            <p className="text-[10px] text-gray-500 mt-1">Ask me about your career path!</p>
          </div>
        )}
        
        <AnimatePresence>
          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[75%] rounded-lg px-3 py-2 text-xs shadow-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
                    : m.isError
                    ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'
                }`}
              >
                <p className="whitespace-pre-wrap leading-snug">{m.content}</p>
                <p className={`text-[9px] mt-1 ${
                  m.role === 'user' ? 'text-white/70' : 'text-gray-400'
                }`}>
                  {formatTime(m.timestamp)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-white border border-gray-200 rounded-lg rounded-bl-sm px-3 py-2 shadow-sm">
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex gap-2 border-t border-gray-200 p-3 bg-white shrink-0">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          className="flex-1 rounded-lg bg-gray-100 px-3 py-2 text-xs text-gray-800 outline-none ring-2 ring-transparent focus:ring-purple-500 transition-all placeholder:text-gray-500"
          placeholder="Type message..."
          disabled={loading}
        />
        <button
          onClick={send}
          disabled={loading || !text.trim()}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-3 py-2 text-white hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg shrink-0"
          aria-label="Send message"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </motion.div>
  );
};

export default ChatbotWindow;
