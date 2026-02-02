import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

const ThemeSwitcher = () => {
  const { currentTheme, changeTheme, themes } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const handleThemeChange = (themeName) => {
    changeTheme(themeName);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      {/* Theme Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
        style={{
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }}
      >
        <span className="text-xl">{themes[currentTheme].icon}</span>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-sm font-semibold leading-none">
            {themes[currentTheme].name}
          </span>
          <span className="text-[10px] opacity-60 leading-none mt-0.5">
            {themes[currentTheme].description}
          </span>
        </div>
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-72 rounded-2xl overflow-hidden z-50"
              style={{
                backgroundColor: 'var(--card-bg)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-xl)'
              }}
            >
              <div className="p-3">
                <div className="px-3 py-2 mb-1 text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                  🎨 Choose Theme
                </div>
                
                {Object.entries(themes).map(([key, theme]) => (
                  <button
                    key={key}
                    onClick={() => handleThemeChange(key)}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative"
                    style={{
                      backgroundColor: currentTheme === key ? 'var(--primary)' : 'transparent',
                      color: currentTheme === key ? 'white' : 'var(--text)',
                      border: currentTheme === key ? 'none' : '1px solid transparent'
                    }}
                    onMouseEnter={(e) => {
                      if (currentTheme !== key) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-secondary)';
                        e.currentTarget.style.borderColor = 'var(--border)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (currentTheme !== key) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = 'transparent';
                      }
                    }}
                  >
                    <span className="text-2xl">{theme.icon}</span>
                    
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-sm leading-none">{theme.name}</div>
                      <div 
                        className="text-[11px] leading-none mt-1"
                        style={{ 
                          color: currentTheme === key ? 'rgba(255,255,255,0.8)' : 'var(--text-muted)'
                        }}
                      >
                        {theme.description}
                      </div>
                    </div>
                    
                    {/* Color Preview Dots */}
                    <div className="flex gap-1.5">
                      <div 
                        className="w-3.5 h-3.5 rounded-full border-2"
                        style={{ 
                          backgroundColor: theme.colors['--primary'],
                          borderColor: currentTheme === key ? 'white' : 'transparent'
                        }}
                      />
                      <div 
                        className="w-3.5 h-3.5 rounded-full border-2" 
                        style={{ 
                          backgroundColor: theme.colors['--secondary'],
                          borderColor: currentTheme === key ? 'white' : 'transparent'
                        }}
                      />
                    </div>
                    
                    {/* Active Indicator */}
                    {currentTheme === key && (
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;
