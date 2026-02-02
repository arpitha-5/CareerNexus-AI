import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * CAREER CONTEXT
 * 
 * Manages global career data:
 * - Selected career/role from guidance page
 * - Experience level
 * - Skills identified
 * - Selected execution path (internship, placement, studies)
 * - Roadmap customization options
 */

const CareerContext = createContext();

export const CareerProvider = ({ children }) => {
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedPath, setSelectedPath] = useState('placement');
  const [careerAnalysis, setCareerAnalysis] = useState(null);
  const [confidence, setConfidence] = useState(0);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (selectedCareer) {
      const careerData = {
        selectedCareer,
        experienceLevel,
        selectedSkills,
        selectedPath,
        careerAnalysis,
        confidence,
        lastUpdated: new Date().toISOString(),
      };
      localStorage.setItem('careerData', JSON.stringify(careerData));
      setLastUpdated(new Date().toISOString());
    }
  }, [selectedCareer, experienceLevel, selectedSkills, selectedPath, careerAnalysis, confidence]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('careerData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSelectedCareer(parsed.selectedCareer);
        setExperienceLevel(parsed.experienceLevel || 'Fresher');
        setSelectedSkills(parsed.selectedSkills || []);
        setSelectedPath(parsed.selectedPath || 'placement');
        setCareerAnalysis(parsed.careerAnalysis);
        setConfidence(parsed.confidence || 0);
        setLastUpdated(parsed.lastUpdated);
      } catch (error) {
        console.error('Error loading career data from localStorage:', error);
      }
    }
  }, []);

  const updateCareerData = (data) => {
    if (data.selectedCareer) setSelectedCareer(data.selectedCareer);
    if (data.experienceLevel) setExperienceLevel(data.experienceLevel);
    if (data.selectedSkills) setSelectedSkills(data.selectedSkills);
    if (data.selectedPath) setSelectedPath(data.selectedPath);
    if (data.careerAnalysis) setCareerAnalysis(data.careerAnalysis);
    if (data.confidence !== undefined) setConfidence(data.confidence);
  };

  const clearCareerData = () => {
    setSelectedCareer(null);
    setExperienceLevel('Fresher');
    setSelectedSkills([]);
    setSelectedPath('placement');
    setCareerAnalysis(null);
    setConfidence(0);
    setLastUpdated(null);
    localStorage.removeItem('careerData');
  };

  const value = {
    selectedCareer,
    setSelectedCareer,
    experienceLevel,
    setExperienceLevel,
    selectedSkills,
    setSelectedSkills,
    selectedPath,
    setSelectedPath,
    careerAnalysis,
    setCareerAnalysis,
    confidence,
    setConfidence,
    lastUpdated,
    updateCareerData,
    clearCareerData,
  };

  return (
    <CareerContext.Provider value={value}>
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within CareerProvider');
  }
  return context;
};
