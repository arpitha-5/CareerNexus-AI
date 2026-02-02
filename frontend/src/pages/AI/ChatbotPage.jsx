// ChatbotPage.jsx
import React from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import ChatbotWindow from '../../components/ai/ChatbotWindow.jsx';

const ChatbotPage = () => {
  return (
    <div className="min-h-screen theme-bg">
      <Navbar />
      <div className="mx-auto max-w-3xl px-4 pt-24 pb-10">
        <h1 className="text-xl font-bold mb-2 theme-text">LearnBuddy – AI Mentor</h1>
        <p className="mb-4 text-xs theme-text-muted">
          Ask doubts, clarify concepts, get project ideas and personalized advice in multiple languages.
        </p>
        <ChatbotWindow />
      </div>
    </div>
  );
};

export default ChatbotPage;