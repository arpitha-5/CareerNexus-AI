import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const themes = {
  light: {
    name: 'Light',
    icon: '',
    description: 'Clean & bright',
    colors: {
      '--bg': '#FFFFFF',
      '--bg-secondary': '#FAFAFA',
      '--card-bg': '#FFFFFF',
      '--text': '#1F2937',
      '--text-secondary': '#4B5563',
      '--text-muted': '#6B7280',
      '--primary': '#6366F1',
      '--primary-hover': '#4F46E5',
      '--secondary': '#0EA5E9',
      '--accent': '#E5E7EB',
      '--border': '#E5E7EB',
      '--border-hover': '#D1D5DB',
      '--success': '#10B981',
      '--error': '#EF4444',
      '--shadow': 'rgba(0, 0, 0, 0.1)',
    }
  },
  dark: {
    name: 'Dark',
    icon: '',
    description: 'Sleek & modern',
    colors: {
      '--bg': '#0F172A',
      '--bg-secondary': '#1E293B',
      '--card-bg': '#1E293B',
      '--text': '#F8FAFC',
      '--text-secondary': '#CBD5E1',
      '--text-muted': '#94A3B8',
      '--primary': '#6366F1',
      '--primary-hover': '#818CF8',
      '--secondary': '#0EA5E9',
      '--accent': '#334155',
      '--border': '#334155',
      '--border-hover': '#475569',
      '--success': '#10B981',
      '--error': '#EF4444',
      '--shadow': 'rgba(0, 0, 0, 0.3)',
    }
  },
  ocean: {
    name: 'Ocean',
    icon: '',
    description: 'Blue & fresh',
    colors: {
      '--bg': '#E0F2FE',
      '--bg-secondary': '#BAE6FD',
      '--card-bg': '#FFFFFF',
      '--text': '#0F172A',
      '--text-secondary': '#1E293B',
      '--text-muted': '#475569',
      '--primary': '#0284C7',
      '--primary-hover': '#0369A1',
      '--secondary': '#0EA5E9',
      '--accent': '#7DD3FC',
      '--border': '#BAE6FD',
      '--border-hover': '#7DD3FC',
      '--success': '#14B8A6',
      '--error': '#EF4444',
      '--shadow': 'rgba(2, 132, 199, 0.1)',
    }
  },
  sunset: {
    name: 'Sunset',
    icon: '',
    description: 'Warm & vibrant',
    colors: {
      '--bg': '#FFF4E6',
      '--bg-secondary': '#FFEDD5',
      '--card-bg': '#FFFFFF',
      '--text': '#7C2D12',
      '--text-secondary': '#9A3412',
      '--text-muted': '#C2410C',
      '--primary': '#FB923C',
      '--primary-hover': '#F97316',
      '--secondary': '#F97316',
      '--accent': '#FED7AA',
      '--border': '#FED7AA',
      '--border-hover': '#FDBA74',
      '--success': '#10B981',
      '--error': '#DC2626',
      '--shadow': 'rgba(251, 146, 60, 0.1)',
    }
  },
  forest: {
    name: 'Forest',
    icon: '',
    description: 'Green & natural',
    colors: {
      '--bg': '#ECFDF5',
      '--bg-secondary': '#D1FAE5',
      '--card-bg': '#FFFFFF',
      '--text': '#064E3B',
      '--text-secondary': '#065F46',
      '--text-muted': '#047857',
      '--primary': '#10B981',
      '--primary-hover': '#059669',
      '--secondary': '#059669',
      '--accent': '#A7F3D0',
      '--border': '#D1FAE5',
      '--border-hover': '#A7F3D0',
      '--success': '#22C55E',
      '--error': '#EF4444',
      '--shadow': 'rgba(16, 185, 129, 0.1)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('careernexus-ai-theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const themeColors = themes[currentTheme].colors;
    
    Object.entries(themeColors).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    
    localStorage.setItem('careernexus-ai-theme', currentTheme);
  }, [currentTheme]);

  const changeTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, changeTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
