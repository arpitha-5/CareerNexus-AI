import React, { useState } from 'react';
import '../styles/ResumeAnalyzer.css';

const ResumeAnalyzer = () => {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  // Handle file drop
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setUploadedFile(file);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;
    
    setIsAnalyzing(true);
    
    // Simulate API call - replace with actual backend call
    setTimeout(() => {
      setAnalysisData({
        resumeScore: 78,
        atsCompatibility: 85,
        roles: [
          { title: 'Software Engineer', match: 92 },
          { title: 'Data Analyst', match: 78 },
          { title: 'Product Manager', match: 65 }
        ],
        skills: [
          { name: 'Python', present: true, required: true },
          { name: 'JavaScript', present: true, required: true },
          { name: 'React', present: true, required: true },
          { name: 'SQL', present: false, required: true },
          { name: 'AWS', present: false, required: true },
          { name: 'Machine Learning', present: true, required: false }
        ],
        summary: {
          strengths: ['Strong technical foundation', 'Good project experience', 'Clear communication skills'],
          gaps: ['Cloud infrastructure experience', 'Database optimization knowledge']
        }
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  const downloadReport = () => {
    alert('Report download functionality coming soon');
  };

  const resetAnalyzer = () => {
    setUploadedFile(null);
    setAnalysisData(null);
  };

  // Circular Progress Component
  const CircularProgress = ({ percentage, label }) => {
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-progress-wrapper">
        <svg className="circular-progress" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" className="progress-bg" />
          <circle
            cx="50"
            cy="50"
            r="45"
            className="progress-fill"
            style={{
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              transition: 'stroke-dashoffset 0.8s ease'
            }}
          />
        </svg>
        <div className="progress-text">
          <span className="progress-value">{percentage}</span>
          <span className="progress-unit">%</span>
        </div>
        <p className="progress-label">{label}</p>
      </div>
    );
  };

  return (
    <div className="resume-analyzer">
      <div className="ra-container">
        {/* Page Header */}
        <div className="ra-header">
          <h1 className="ra-title">AI Resume Analyzer</h1>
          <p className="ra-subtitle">ATS-aware resume analysis for career readiness</p>
        </div>

        {!analysisData ? (
          /* Upload Section */
          <div className="ra-upload-section">
            <div
              className={`ra-upload-card ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="upload-icon">
                <i className="fas fa-cloud-arrow-up"></i>
              </div>
              <h3 className="upload-title">Upload Your Resume</h3>
              <p className="upload-text">Drag and drop your PDF resume here, or click to browse</p>
              
              <input
                type="file"
                id="resume-input"
                className="hidden-file-input"
                accept=".pdf"
                onChange={handleFileInputChange}
              />
              
              <label htmlFor="resume-input" className="upload-button">
                <span>Select Resume</span>
              </label>

              {uploadedFile && (
                <div className="file-preview">
                  <i className="fas fa-file-pdf"></i>
                  <span>{uploadedFile.name}</span>
                </div>
              )}
            </div>

            {uploadedFile && (
              <div className="analyze-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setUploadedFile(null)}
                >
                  Clear
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Analysis Dashboard */
          <>
            {/* Resume Scores */}
            <div className="ra-scores-section">
              <div className="score-card">
                <CircularProgress
                  percentage={analysisData.resumeScore}
                  label="Resume Strength"
                />
              </div>
              <div className="ats-badge">
                <div className="badge-icon">✓</div>
                <div className="badge-content">
                  <h4>ATS Compatibility</h4>
                  <p>{analysisData.atsCompatibility}% Pass Rate</p>
                </div>
              </div>
            </div>

            {/* Role Match Cards */}
            <div className="ra-roles-section">
              <h2 className="section-title">Career Role Match</h2>
              <div className="roles-grid">
                {analysisData.roles.map((role, idx) => (
                  <div key={idx} className="role-card">
                    <h3 className="role-title">{role.title}</h3>
                    <div className="role-match-bar">
                      <div
                        className="role-match-fill"
                        style={{ width: `${role.match}%` }}
                      ></div>
                    </div>
                    <p className="role-match-text">{role.match}% Match</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Skill Analysis */}
            <div className="ra-skills-section">
              <h2 className="section-title">Skill Analysis</h2>
              <div className="skills-list">
                <div className="skills-column">
                  <h4 className="column-title">Present Skills</h4>
                  <ul className="skill-items">
                    {analysisData.skills
                      .filter(s => s.present)
                      .map((skill, idx) => (
                        <li key={idx} className="skill-item present">
                          <span className="skill-badge">✓</span>
                          <span className="skill-name">{skill.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="skills-column">
                  <h4 className="column-title">Missing Skills</h4>
                  <ul className="skill-items">
                    {analysisData.skills
                      .filter(s => !s.present && s.required)
                      .map((skill, idx) => (
                        <li key={idx} className="skill-item missing">
                          <span className="skill-badge">—</span>
                          <span className="skill-name">{skill.name}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="ra-summary-section">
              <div className="summary-card strengths">
                <h3 className="summary-title">Your Strengths</h3>
                <ul className="summary-list">
                  {analysisData.summary.strengths.map((item, idx) => (
                    <li key={idx}>
                      <span className="check-icon">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="summary-card gaps">
                <h3 className="summary-title">Skill Gaps</h3>
                <ul className="summary-list">
                  {analysisData.summary.gaps.map((item, idx) => (
                    <li key={idx}>
                      <span className="warning-icon">!</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="ra-actions-section">
              <button className="btn btn-primary" onClick={downloadReport}>
                <i className="fas fa-download"></i> Download Report
              </button>
              <button className="btn btn-secondary" onClick={resetAnalyzer}>
                <i className="fas fa-redo"></i> Analyze Another Resume
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
