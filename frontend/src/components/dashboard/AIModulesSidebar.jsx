import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext.jsx';

const AIModulesSidebar = () => {
  const { user } = useAuth();
  const [expandedCategory, setExpandedCategory] = useState(null); // 'essential' Default expanded if needed, else null
  const location = useLocation();

  const categories = {
    essential: {
      title: 'Navigation & Career',
      modules: [
        { path: '/career/resume', icon: '📄', title: 'Upload Resume', desc: 'ATS analysis' },
        { path: '/career/courses', icon: '📚', title: 'Browse Courses', desc: 'Curated learning' },
        { path: '/career/internships', icon: '💼', title: 'Find Internships', desc: 'Opportunities' },
        { path: '/profile', icon: '⚙️', title: 'Edit Profile', desc: 'Settings' }
      ]
    },
    learning: {
      title: 'AI Learning Tools',
      modules: [
        { path: '/career/skill-gap', icon: '⚡', title: 'Skill Gap Engine', desc: 'Identify gaps' },
        { path: '/career/match', icon: '🎯', title: 'Job Role Match', desc: 'Career fit' },
        { path: '/career/learning-path', icon: '🗺️', title: 'Learning Path', desc: 'Your roadmap' },
        { path: '/career/advisor', icon: '🤖', title: 'Career Advisor', desc: 'AI guidance' }
      ]
    },
    tools: {
      title: 'AI Assistance',
      modules: [
        { path: '/ai/code-mentor', icon: '💻', title: 'Code Mentor', desc: 'Debug help' },
        { path: '/career/interview', icon: '🎤', title: 'Interview Bot', desc: 'Mock practice', badge: 'LIVE' },
        { path: '/ai/chatbot', icon: '💬', title: 'AI Chat', desc: 'Q&A' }
      ]
    },

  };

  const ModuleItem = ({ module }) => {
    const isActive = location.pathname === module.path;

    return (
      <Link
        to={module.path}
        className={`group flex items-center gap-3 px-4 py-3 mx-2 rounded-lg transition-all duration-200 ${isActive
          ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border-l-4 border-transparent'
          }`}
      >
        <span className={`text-lg ${isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
          {module.icon}
        </span>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${isActive ? 'font-semibold' : ''}`}>
              {module.title}
            </span>
            {module.badge && (
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-100 text-indigo-700 rounded-full">
                {module.badge}
              </span>
            )}
          </div>
          <p className={`text-[10px] ${isActive ? 'text-indigo-500' : 'text-slate-400 group-hover:text-slate-500'}`}>
            {module.desc}
          </p>
        </div>
      </Link>
    );
  };

  const CategorySection = ({ categoryKey, category }) => {
    // Determine if section should be open (if it contains active route)
    const hasActiveRoute = category.modules.some(m => location.pathname === m.path);
    const isOpen = expandedCategory === categoryKey || hasActiveRoute;

    return (
      <div className="mb-4">
        <button
          onClick={() => setExpandedCategory(isOpen ? null : categoryKey)}
          className="w-full flex items-center justify-between px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors"
        >
          {category.title}
        </button>

        <div className="space-y-1 mt-1">
          {category.modules.map((module) => (
            <ModuleItem key={module.path} module={module} />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="py-6 h-full flex flex-col bg-white">
      {/* Brand in Sidebar (Optional if Navbar exists, but good for context) */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-indigo-200">
            N
          </div>
          <div>
            <h2 className="font-bold text-slate-900 text-lg leading-tight">NEXUS</h2>
            <p className="text-[10px] text-slate-500 font-medium">Career Intelligence</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {Object.entries(categories).map(([key, category]) => (
          <CategorySection key={key} categoryKey={key} category={category} />
        ))}
      </div>

      {/* User Mini Profile */}
      <div className="px-4 py-4 border-t border-slate-100">
        <Link to="/profile" className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name || 'User'}
              className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:border-slate-300"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 group-hover:bg-slate-300 border border-transparent">
              {user?.name
                ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
                : 'JD'}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'Guest Student'}</p>
              {/* Online Dot */}
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm" title="Online"></div>
            </div>
            <p className="text-xs text-slate-500 truncate">{user?.role || 'Student Account'}</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AIModulesSidebar;
