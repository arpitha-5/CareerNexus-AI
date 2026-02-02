import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCareer } from '../../context/CareerContext.jsx';
import '../../styles/CareerGuidance.css';

const CareerGuidance = () => {
  const { 
    setSelectedCareer, 
    setSelectedPath, 
    setCareerAnalysis, 
    setConfidence,
    experienceLevel,
    setExperienceLevel
  } = useCareer();

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cgpa: 7,
    skills: {
      Python: 0,
      Java: 0,
      SQL: 0,
      ML: 0,
      Communication: 0,
      ProblemSolving: 0,
    },
    interests: {
      Data_Interest: 50,
      Development_Interest: 50,
      Management_Interest: 50,
      Research_Interest: 50,
      Design_Interest: 50,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  // Progress calculation
  const calculateProgress = () => {
    let filled = 0;
    if (formData.name) filled++;
    if (formData.email) filled++;
    const skillsFilled = Object.values(formData.skills).filter(v => v > 0).length;
    if (skillsFilled >= 3) filled++;
    const interestsFilled = Object.values(formData.interests).filter(v => v > 40).length;
    if (interestsFilled >= 2) filled++;
    return Math.min((filled / 4) * 100, 100);
  };

  // Handle slider changes
  const handleSkillChange = (skill, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: parseInt(value) }
    }));
  };

  const handleInterestChange = (interest, value) => {
    setFormData(prev => ({
      ...prev,
      interests: { ...prev.interests, [interest]: parseInt(value) }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cgpa' ? parseFloat(value) : value
    }));
  };

  // Submit assessment to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/career/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cgpa: formData.cgpa,
          skills: formData.skills,
          interests: formData.interests,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      
      // Extract primary career
      const primaryCareer = data.topCareers?.[0]?.career || 'Data Analyst';
      const confidence = data.topCareers?.[0]?.confidence || 75;

      // Update global context
      setSelectedCareer(primaryCareer);
      setSelectedPath('placement');
      setCareerAnalysis(data);
      setConfidence(confidence);

      setResults(data);
      setShowResults(true);

      // Save to localStorage
      localStorage.setItem('careerAssessment', JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing career. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="career-guidance-container">
      {/* Floating Navigation */}
      <motion.nav 
        className="floating-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-container">
          <a href="#assess" className="nav-tab active" onClick={() => scrollToSection('assess')}>
            <i className="fas fa-check-circle"></i>
            <span>Assess</span>
          </a>
          <a href="#results" className="nav-tab" onClick={() => scrollToSection('results')}>
            <i className="fas fa-chart-line"></i>
            <span>Results</span>
          </a>
          <a href="#roadmap" className="nav-tab" onClick={() => scrollToSection('roadmap')}>
            <i className="fas fa-road"></i>
            <span>Roadmap</span>
          </a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            style={{
              fontSize: '3.5rem',
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Career Guidance
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            style={{ fontSize: '1.3rem', color: '#fff', marginTop: '1rem' }}
          >
            Discover Your Perfect Career Path
          </motion.p>
          <motion.p
            className="subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get AI-powered insights tailored to your skills, interests, and aspirations
          </motion.p>
          <motion.button
            className="cta-btn"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('assess')}
          >
            🚀 Begin Assessment
          </motion.button>
        </div>
        <div className="hero-bg"></div>
      </motion.section>

      {/* Assessment Section */}
      <motion.section 
        id="assess"
        className="assessment"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="container">
          {/* Progress Header */}
          <motion.div className="progress-header">
            <div className="progress-info">
              <h2>Career Assessment</h2>
              <p className="section-subtitle">Answer honestly about your skills, interests, and academic performance</p>
            </div>
            <div className="progress-bar-container">
              <div className="progress-label">
                <span>Progress:</span>
                <span id="progressPercent">{Math.round(calculateProgress())}%</span>
              </div>
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="form-container">
            {/* Skills Section */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-code"></i> Technical Skills</h3>
              <p className="form-hint">Rate your proficiency (1-5)</p>

              <div className="skills-grid">
                {Object.entries(formData.skills).map(([skill, value]) => (
                  <motion.div 
                    key={skill}
                    className="skill-input"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label>{skill}</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={value}
                        onChange={(e) => handleSkillChange(skill, e.target.value)}
                        className="slider"
                      />
                      <span className="slider-value">{value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interests Section */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-heart"></i> Career Interests</h3>
              <p className="form-hint">Rate your interest level (0-100)</p>

              <div className="interests-grid">
                {Object.entries(formData.interests).map(([interest, value]) => (
                  <motion.div 
                    key={interest}
                    className="interest-input"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label>{interest.replace('_Interest', '').replace('_', ' ')}</label>
                    <div className="slider-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleInterestChange(interest, e.target.value)}
                        className="slider"
                      />
                      <span className="slider-value">{value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Academic Section */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-graduation-cap"></i> Academic Performance</h3>

              <div className="form-group">
                <label>CGPA (0-10):</label>
                <div className="input-with-slider">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    name="cgpa"
                    className="slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    name="cgpa"
                    className="number-input"
                  />
                  <span>/10</span>
                </div>
              </div>
            </motion.div>

            {/* Personal Info Section */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-user"></i> Personal Information</h3>

              <div className="form-group">
                <label>Full Name:</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <span className="loading-spinner"></span> Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i> Get AI Career Prediction
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.section>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && results && (
          <motion.section 
            id="results"
            className="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="container">
              <motion.h2
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                Your Career Analysis
              </motion.h2>

              {/* Primary Career Card */}
              <motion.div 
                className="card primary-career-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3>🎯 Primary Career Recommendation</h3>
                <div className="career-display">
                  <h2 id="careerTitle">{results.topCareers?.[0]?.career || 'Loading...'}</h2>
                  <div className="confidence-meter">
                    <motion.div 
                      className="confidence-bar"
                      initial={{ width: 0 }}
                      animate={{ width: `${results.topCareers?.[0]?.confidence || 0}%` }}
                      transition={{ duration: 1, delay: 0.3 }}
                    ></motion.div>
                  </div>
                  <p id="confidenceText">Confidence: {results.topCareers?.[0]?.confidence || 0}%</p>
                </div>
              </motion.div>

              {/* Readiness Score */}
              <motion.div 
                className="card readiness-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <h3>📊 Career Readiness Score</h3>
                <div className="readiness-display">
                  <motion.div 
                    className="circular-progress"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="progress-bg"></circle>
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        className="progress-fill"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (results.readinessScore || 0) * 2.83 }}
                        transition={{ duration: 1, delay: 0.3 }}
                      ></motion.circle>
                    </svg>
                    <div className="progress-text">
                      <span id="readinessScore">{results.readinessScore || 0}</span>
                      <span>/100</span>
                    </div>
                  </motion.div>
                  <div className="readiness-breakdown">
                    <p id="readinessStatus">Career Ready</p>
                    <div className="breakdown-items">
                      <div className="breakdown-item">
                        <label>Skills Match</label>
                        <div className="mini-bar">
                          <motion.div 
                            id="skillsBar"
                            initial={{ width: 0 }}
                            animate={{ width: `${results.skillsScore || 0}%` }}
                            transition={{ duration: 1, delay: 0.4 }}
                          ></motion.div>
                        </div>
                        <span id="skillsScore">{results.skillsScore || 0}%</span>
                      </div>
                      <div className="breakdown-item">
                        <label>Academic Score</label>
                        <div className="mini-bar">
                          <motion.div 
                            id="academicBar"
                            initial={{ width: 0 }}
                            animate={{ width: `${results.academicScore || 0}%` }}
                            transition={{ duration: 1, delay: 0.5 }}
                          ></motion.div>
                        </div>
                        <span id="academicScore">{results.academicScore || 0}%</span>
                      </div>
                      <div className="breakdown-item">
                        <label>Interest Alignment</label>
                        <div className="mini-bar">
                          <motion.div 
                            id="interestBar"
                            initial={{ width: 0 }}
                            animate={{ width: `${results.interestScore || 0}%` }}
                            transition={{ duration: 1, delay: 0.6 }}
                          ></motion.div>
                        </div>
                        <span id="interestScore">{results.interestScore || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Top 3 Careers */}
              <motion.div 
                className="card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h3>🏆 Top 3 Career Recommendations</h3>
                <div className="careers-list" id="top3Careers">
                  {results.topCareers?.map((career, index) => (
                    <motion.div 
                      key={index}
                      className="career-item"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    >
                      <div className="career-rank">{index + 1}</div>
                      <div className="career-info">
                        <span className="career-name">{career.career}</span>
                        <span className="career-confidence">{career.confidence}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loading-spinner-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="spinner"></div>
            <p>Analyzing your profile...</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerGuidance;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cgpa: 7,
    skills: {
      Python: 0,
      Java: 0,
      SQL: 0,
      ML: 0,
      Communication: 0,
      ProblemSolving: 0,
    },
    interests: {
      Data_Interest: 50,
      Development_Interest: 50,
      Management_Interest: 50,
      Research_Interest: 50,
      Design_Interest: 50,
    },
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [roadmapData, setRoadmapData] = useState(null);

  // Progress calculation
  const calculateProgress = () => {
    let filled = 0;
    if (formData.name) filled++;
    if (formData.email) filled++;
    const skillsFilled = Object.values(formData.skills).filter(v => v > 0).length;
    if (skillsFilled >= 3) filled++;
    const interestsFilled = Object.values(formData.interests).filter(v => v > 40).length;
    if (interestsFilled >= 2) filled++;
    return Math.min((filled / 4) * 100, 100);
  };

  // Handle slider changes
  const handleSkillChange = (skill, value) => {
    setFormData(prev => ({
      ...prev,
      skills: { ...prev.skills, [skill]: parseInt(value) }
    }));
  };

  const handleInterestChange = (interest, value) => {
    setFormData(prev => ({
      ...prev,
      interests: { ...prev.interests, [interest]: parseInt(value) }
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'cgpa' ? parseFloat(value) : value
    }));
  };

  // Submit assessment to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/api/career/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          cgpa: formData.cgpa,
          skills: formData.skills,
          interests: formData.interests,
        }),
      });

      if (!response.ok) throw new Error('Failed to analyze');

      const data = await response.json();
      
      // Extract primary career
      const primaryCareer = data.topCareers?.[0]?.career || 'Data Analyst';
      const confidence = data.topCareers?.[0]?.confidence || 75;

      // Update global context
      setSelectedCareer(primaryCareer);
      setSelectedPath('placement');
      setCareerAnalysis(data);
      setConfidence(confidence);

      setResults(data);
      setShowResults(true);

      // Save to localStorage
      localStorage.setItem('careerAssessment', JSON.stringify({
        ...data,
        timestamp: new Date().toISOString(),
      }));
    } catch (error) {
      console.error('Error:', error);
      alert('Error analyzing career. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="career-guidance-container">
      {/* Floating Navigation */}
      <motion.nav 
        className="career-floating-nav"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nav-content">
          <motion.a 
            href="#assess" 
            className="nav-item active"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('assess')}
          >
            <i className="fas fa-check-circle"></i>
            <span>Assess</span>
          </motion.a>
          <motion.a 
            href="#results" 
            className="nav-item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('results')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Results</span>
          </motion.a>
          <motion.a 
            href="#roadmap" 
            className="nav-item"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('roadmap')}
          >
            <i className="fas fa-road"></i>
            <span>Roadmap</span>
          </motion.a>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.section 
        className="career-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="hero-content">
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            Career Guidance
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Discover Your Perfect Career Path
          </motion.p>
          <motion.p
            className="hero-description"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Get AI-powered insights tailored to your skills, interests, and aspirations
          </motion.p>
          <motion.button
            className="cta-button"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(79, 70, 229, 0.3)' }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('assess')}
          >
            🚀 Begin Assessment
          </motion.button>
        </div>
        <div className="hero-background"></div>
      </motion.section>

      {/* Assessment Section */}
      <motion.section 
        id="assess"
        className="career-assessment"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <div className="assessment-container">
          {/* Progress Bar */}
          <motion.div className="progress-section">
            <div className="progress-info">
              <h2>Career Assessment</h2>
              <p>Answer honestly about your skills, interests, and academic performance</p>
            </div>
            <div className="progress-bar-wrapper">
              <div className="progress-bar">
                <motion.div 
                  className="progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
              <span className="progress-text">{Math.round(calculateProgress())}%</span>
            </div>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="career-form">
            {/* Personal Info */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-user"></i> Personal Information</h3>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </motion.div>

            {/* Skills */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-code"></i> Technical Skills</h3>
              <p className="form-hint">Rate your proficiency (1-5)</p>
              <div className="skills-grid">
                {Object.entries(formData.skills).map(([skill, value]) => (
                  <motion.div 
                    key={skill}
                    className="skill-item"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label>{skill.replace('_', ' ')}</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="5"
                        value={value}
                        onChange={(e) => handleSkillChange(skill, e.target.value)}
                        className="slider"
                      />
                      <span className="value-display">{value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Interests */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-heart"></i> Career Interests</h3>
              <p className="form-hint">Rate your interest level (0-100)</p>
              <div className="interests-grid">
                {Object.entries(formData.interests).map(([interest, value]) => (
                  <motion.div 
                    key={interest}
                    className="interest-item"
                    whileHover={{ scale: 1.02 }}
                  >
                    <label>{interest.replace('_Interest', '').replace('_', ' ')}</label>
                    <div className="slider-wrapper">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={value}
                        onChange={(e) => handleInterestChange(interest, e.target.value)}
                        className="slider"
                      />
                      <span className="value-display">{value}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CGPA */}
            <motion.div 
              className="form-section"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3><i className="fas fa-graduation-cap"></i> Academic Performance</h3>
              <div className="form-group cgpa-group">
                <label>CGPA (0-10)</label>
                <div className="cgpa-input-wrapper">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    name="cgpa"
                    className="slider"
                  />
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.cgpa}
                    onChange={handleInputChange}
                    name="cgpa"
                    className="number-input"
                  />
                  <span>/10</span>
                </div>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="submit-button"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <i className="fas fa-wand-magic-sparkles"></i> Get AI Career Prediction
                </>
              )}
            </motion.button>
          </form>
        </div>
      </motion.section>

      {/* Results Section */}
      <AnimatePresence>
        {showResults && results && (
          <motion.section 
            id="results"
            className="career-results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="results-container">
              <h2>Your Career Analysis</h2>

              {/* Primary Career Card */}
              <motion.div 
                className="result-card primary-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="card-header">
                  <h3>🎯 Primary Career Recommendation</h3>
                </div>
                <div className="card-content">
                  <h2 className="career-title">{results.topCareers?.[0]?.career || 'Loading...'}</h2>
                  <div className="confidence-section">
                    <div className="confidence-meter">
                      <motion.div 
                        className="confidence-bar"
                        initial={{ width: 0 }}
                        animate={{ width: `${results.topCareers?.[0]?.confidence || 0}%` }}
                        transition={{ duration: 1, delay: 0.3 }}
                      ></motion.div>
                    </div>
                    <p className="confidence-text">Confidence: {results.topCareers?.[0]?.confidence || 0}%</p>
                  </div>
                  <p className="career-description">{results.topCareers?.[0]?.reason || ''}</p>
                </div>
              </motion.div>

              {/* Top 3 Careers */}
              <motion.div 
                className="result-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="card-header">
                  <h3>🏆 Top 3 Career Recommendations</h3>
                </div>
                <div className="careers-list">
                  {results.topCareers?.map((career, index) => (
                    <motion.div 
                      key={index}
                      className="career-item"
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="rank">{index + 1}</div>
                      <div className="career-info">
                        <span className="career-name">{career.career}</span>
                        <span className="confidence-badge">{career.confidence}%</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Readiness Score */}
              <motion.div 
                className="result-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="card-header">
                  <h3>📊 Career Readiness Score</h3>
                </div>
                <div className="readiness-content">
                  <motion.div 
                    className="circular-progress"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" className="bg"></circle>
                      <motion.circle 
                        cx="50" 
                        cy="50" 
                        r="45" 
                        className="fill"
                        initial={{ strokeDashoffset: 283 }}
                        animate={{ strokeDashoffset: 283 - (results.readinessScore || 0) * 2.83 }}
                        transition={{ duration: 1, delay: 0.3 }}
                      ></motion.circle>
                    </svg>
                    <div className="score-text">
                      <span className="score-value">{results.readinessScore || 0}</span>
                      <span className="score-max">/100</span>
                    </div>
                  </motion.div>
                  <div className="breakdown">
                    {[
                      { label: 'Skills Match', value: results.skillsScore || 0 },
                      { label: 'Academic Score', value: results.academicScore || 0 },
                      { label: 'Interest Alignment', value: results.interestScore || 0 },
                    ].map((item, idx) => (
                      <motion.div 
                        key={idx}
                        className="breakdown-item"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + idx * 0.1 }}
                      >
                        <span className="label">{item.label}</span>
                        <div className="mini-bar">
                          <motion.div 
                            className="fill"
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1, delay: 0.5 + idx * 0.1 }}
                          ></motion.div>
                        </div>
                        <span className="percentage">{item.value}%</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div 
            className="loading-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="loading-content">
              <motion.div 
                className="spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              ></motion.div>
              <p>Analyzing your profile with AI...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerGuidance;
