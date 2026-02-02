import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateCareerGuidance } from '../../api/careerGuidanceApi.js';
import jsPDF from 'jspdf';

const CareerGuidanceStep = ({ profile, onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  // Skill Assessment State
  const [skillLevels, setSkillLevels] = useState({
    python: 0,
    javascript: 0,
    java: 0,
    dataAnalysis: 0,
    machineLearning: 0,
    webDevelopment: 0,
    communication: 0,
    problemSolving: 0,
    leadership: 0,
    creativity: 0,
  });

  // Interest Assessment State
  const [interestLevels, setInterestLevels] = useState({
    softwareDevelopment: 50,
    dataScience: 50,
    aiMachineLearning: 50,
    cloudComputing: 50,
    cybersecurity: 50,
    management: 50,
    research: 50,
    design: 50,
  });

  // Personal Info
  const [personalInfo, setPersonalInfo] = useState({
    cgpa: 7.0,
    experience: profile?.profile?.year || '',
    aspirations: '',
  });

  const handleSkillChange = (skill, value) => {
    setSkillLevels(prev => ({ ...prev, [skill]: parseInt(value) }));
  };

  const handleInterestChange = (interest, value) => {
    setInterestLevels(prev => ({ ...prev, [interest]: parseInt(value) }));
  };

  const getSkillColor = (level) => {
    if (level >= 4) return 'from-green-500 to-emerald-500';
    if (level >= 2) return 'from-yellow-500 to-orange-500';
    return 'from-gray-400 to-gray-500';
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);

    try {
      // Convert skill levels to skill names with proficiency
      const skills = Object.entries(skillLevels)
        .filter(([_, level]) => level > 0)
        .map(([skill, level]) => `${skill.replace(/([A-Z])/g, ' $1').trim()} (${level}/5)`);

      // Convert interest levels to interests
      const interests = Object.entries(interestLevels)
        .filter(([_, level]) => level >= 60)
        .map(([interest, _]) => interest.replace(/([A-Z])/g, ' $1').trim());

      const response = await generateCareerGuidance({
        skills,
        interests,
        academics: `CGPA: ${personalInfo.cgpa}`,
        goals: personalInfo.aspirations,
        experience: personalInfo.experience,
      });

      setResult(response.data.data);
      setCurrentStep(4);
    } catch (err) {
      console.error('Career guidance error:', err);
      setError(err.response?.data?.error || 'Failed to generate career guidance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDFReport = () => {
    if (!result) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    const checkNewPage = (neededSpace = 20) => {
      if (yPos + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Title Page
    doc.setFillColor(124, 58, 237);
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Career Guidance Report', pageWidth / 2, 30, { align: 'center' });
    doc.setFontSize(14);
    doc.text('CareerNexus AI - Your Personalized Career Roadmap', pageWidth / 2, 45, { align: 'center' });
    
    yPos = 70;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, margin, yPos);
    yPos += 15;

    // Recommended Career
    checkNewPage(40);
    doc.setFillColor(240, 240, 255);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 35, 'F');
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(124, 58, 237);
    doc.text('Recommended Career Path', margin + 5, yPos + 5);
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(result.recommendedCareer || 'N/A', margin + 5, yPos + 15);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const careerDesc = doc.splitTextToSize(result.careerDescription || '', pageWidth - 2 * margin - 10);
    doc.text(careerDesc, margin + 5, yPos + 25);
    yPos += 45;

    // Confidence Score
    checkNewPage(30);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`Confidence Score: ${result.confidenceScore || 0}%`, margin, yPos);
    yPos += 10;
    doc.setDrawColor(34, 197, 94);
    doc.setFillColor(34, 197, 94);
    const barWidth = ((result.confidenceScore || 0) / 100) * (pageWidth - 2 * margin);
    doc.rect(margin, yPos, barWidth, 8, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, yPos, pageWidth - 2 * margin, 8, 'S');
    yPos += 20;

    // Why This Career
    if (result.whyThisCareer) {
      checkNewPage(40);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(234, 179, 8);
      doc.text('Why This Career?', margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      const whyText = doc.splitTextToSize(result.whyThisCareer, pageWidth - 2 * margin);
      whyText.forEach(line => {
        checkNewPage();
        doc.text(line, margin, yPos);
        yPos += 6;
      });
      yPos += 5;
    }

    // Priority Skills
    if (result.prioritySkills && result.prioritySkills.length > 0) {
      checkNewPage(50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(59, 130, 246);
      doc.text('Priority Skills to Learn', margin, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      result.prioritySkills.forEach((skill, idx) => {
        checkNewPage();
        doc.text(`${idx + 1}. ${skill}`, margin + 5, yPos);
        yPos += 7;
      });
      yPos += 5;
    }

    // Short-term Actions
    if (result.shortTermSteps && result.shortTermSteps.length > 0) {
      checkNewPage(50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(249, 115, 22);
      doc.text('Short-term Action Plan', margin, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      result.shortTermSteps.forEach((step, idx) => {
        checkNewPage(15);
        const stepText = `${idx + 1}. ${step}`;
        const splitStep = doc.splitTextToSize(stepText, pageWidth - 2 * margin - 10);
        splitStep.forEach(line => {
          checkNewPage();
          doc.text(line, margin + 5, yPos);
          yPos += 6;
        });
        yPos += 2;
      });
    }

    // Learning Roadmap
    if (result.learningRoadmap && result.learningRoadmap.length > 0) {
      checkNewPage(50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(16, 185, 129);
      doc.text('6-Month Learning Roadmap', margin, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      result.learningRoadmap.forEach((item, idx) => {
        checkNewPage(20);
        doc.setFont('helvetica', 'bold');
        doc.text(`Month ${idx + 1}:`, margin + 5, yPos);
        yPos += 6;
        doc.setFont('helvetica', 'normal');
        if (typeof item === 'string') {
          const itemText = doc.splitTextToSize(item, pageWidth - 2 * margin - 15);
          itemText.forEach(line => {
            checkNewPage();
            doc.text(line, margin + 10, yPos);
            yPos += 5;
          });
        } else if (item.topics) {
          item.topics.forEach(topic => {
            checkNewPage();
            doc.text(`• ${topic}`, margin + 10, yPos);
            yPos += 5;
          });
        }
        yPos += 3;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by CareerNexus AI - Your Intelligent Career Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });

    doc.save(`Career_Guidance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const SkillSlider = ({ label, skillKey, emoji }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium flex items-center gap-2">
          <span>{emoji}</span>
          <span>{label}</span>
        </label>
        <span className="text-lg font-bold px-3 py-1 rounded-full bg-white/20">
          {skillLevels[skillKey]}/5
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="5"
        value={skillLevels[skillKey]}
        onChange={(e) => handleSkillChange(skillKey, e.target.value)}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, 
            ${skillLevels[skillKey] >= 4 ? '#10b981' : skillLevels[skillKey] >= 2 ? '#f59e0b' : '#6b7280'} 0%, 
            ${skillLevels[skillKey] >= 4 ? '#059669' : skillLevels[skillKey] >= 2 ? '#d97706' : '#4b5563'} ${(skillLevels[skillKey] / 5) * 100}%, 
            rgba(255,255,255,0.1) ${(skillLevels[skillKey] / 5) * 100}%, 
            rgba(255,255,255,0.1) 100%)`
        }}
      />
    </motion.div>
  );

  const InterestSlider = ({ label, interestKey, emoji }) => (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-2"
    >
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium flex items-center gap-2">
          <span>{emoji}</span>
          <span>{label}</span>
        </label>
        <span className="text-lg font-bold px-3 py-1 rounded-full bg-white/20">
          {interestLevels[interestKey]}%
        </span>
      </div>
      <input
        type="range"
        min="0"
        max="100"
        value={interestLevels[interestKey]}
        onChange={(e) => handleInterestChange(interestKey, e.target.value)}
        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, 
            #8b5cf6 0%, 
            #ec4899 ${interestLevels[interestKey]}%, 
            rgba(255,255,255,0.1) ${interestLevels[interestKey]}%, 
            rgba(255,255,255,0.1) 100%)`
        }}
      />
    </motion.div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 text-white"
    >
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-bold">🎯 Career Guidance Assessment</h2>
          <span className="text-sm px-4 py-2 bg-white/20 rounded-full">Step {currentStep}/3</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(currentStep / 3) * 100}%` }}
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Skill Assessment */}
        {currentStep === 1 && (
          <motion.div
            key="skills"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold mb-2">💼 Skill Assessment</h3>
              <p className="text-gray-300 text-sm mb-6">Rate your proficiency in these skills (0 = No knowledge, 5 = Expert)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SkillSlider label="Python" skillKey="python" emoji="🐍" />
                <SkillSlider label="JavaScript" skillKey="javascript" emoji="⚡" />
                <SkillSlider label="Java" skillKey="java" emoji="☕" />
                <SkillSlider label="Data Analysis" skillKey="dataAnalysis" emoji="📊" />
                <SkillSlider label="Machine Learning" skillKey="machineLearning" emoji="🤖" />
                <SkillSlider label="Web Development" skillKey="webDevelopment" emoji="🌐" />
                <SkillSlider label="Communication" skillKey="communication" emoji="💬" />
                <SkillSlider label="Problem Solving" skillKey="problemSolving" emoji="🧩" />
                <SkillSlider label="Leadership" skillKey="leadership" emoji="👑" />
                <SkillSlider label="Creativity" skillKey="creativity" emoji="🎨" />
              </div>
            </div>

            <button
              onClick={() => setCurrentStep(2)}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold py-3 rounded-lg transition-all"
            >
              Next: Interest Analysis →
            </button>
          </motion.div>
        )}

        {/* Step 2: Interest Analysis */}
        {currentStep === 2 && (
          <motion.div
            key="interests"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold mb-2">❤️ Interest Analysis</h3>
              <p className="text-gray-300 text-sm mb-6">How interested are you in these career domains? (0-100%)</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InterestSlider label="Software Development" interestKey="softwareDevelopment" emoji="💻" />
                <InterestSlider label="Data Science" interestKey="dataScience" emoji="📈" />
                <InterestSlider label="AI & Machine Learning" interestKey="aiMachineLearning" emoji="🧠" />
                <InterestSlider label="Cloud Computing" interestKey="cloudComputing" emoji="☁️" />
                <InterestSlider label="Cybersecurity" interestKey="cybersecurity" emoji="🔒" />
                <InterestSlider label="Management" interestKey="management" emoji="📋" />
                <InterestSlider label="Research" interestKey="research" emoji="🔬" />
                <InterestSlider label="Design" interestKey="design" emoji="🎨" />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(1)}
                className="flex-1 bg-white/10 hover:bg-white/20 font-semibold py-3 rounded-lg transition-all"
              >
                ← Back
              </button>
              <button
                onClick={() => setCurrentStep(3)}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 font-bold py-3 rounded-lg transition-all"
              >
                Next: Personal Info →
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Personal Information */}
        {currentStep === 3 && (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-xl font-bold mb-2">👤 Personal Information</h3>
              <p className="text-gray-300 text-sm mb-6">Tell us about your academic background and goals</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-3">CGPA / GPA</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.1"
                      value={personalInfo.cgpa}
                      onChange={(e) => setPersonalInfo(prev => ({ ...prev, cgpa: parseFloat(e.target.value) }))}
                      className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, 
                          #10b981 0%, 
                          #059669 ${(personalInfo.cgpa / 10) * 100}%, 
                          rgba(255,255,255,0.1) ${(personalInfo.cgpa / 10) * 100}%, 
                          rgba(255,255,255,0.1) 100%)`
                      }}
                    />
                    <span className="text-2xl font-bold px-4 py-2 bg-white/20 rounded-lg min-w-[80px] text-center">
                      {personalInfo.cgpa.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Experience / Education Level</label>
                  <input
                    type="text"
                    value={personalInfo.experience}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="e.g., Final Year B.Tech, 2 years experience, Fresher"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Career Aspirations & Goals</label>
                  <textarea
                    value={personalInfo.aspirations}
                    onChange={(e) => setPersonalInfo(prev => ({ ...prev, aspirations: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Tell us about your dream job, companies you admire, or specific goals..."
                    rows="3"
                  />
                </div>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                disabled={loading}
                className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 font-semibold py-3 rounded-lg transition-all"
              >
                ← Back
              </button>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 disabled:opacity-50 font-bold py-3 rounded-lg transition-all relative overflow-hidden"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      🔄
                    </motion.span>
                    Analyzing...
                  </span>
                ) : (
                  '✨ Generate Career Guidance'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Results */}
        {currentStep === 4 && result && (
          <motion.div
            key="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <h3 className="text-2xl font-bold mb-4">🎉 Your Personalized Career Path</h3>

            {/* Recommended Career */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-white/30 rounded-xl p-6"
            >
              <h4 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 mb-3">
                {result.recommendedCareer}
              </h4>
              <p className="text-gray-200">{result.careerDescription}</p>
            </motion.div>

            {/* Confidence Score */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 border border-white/20 rounded-xl p-6"
            >
              <h4 className="font-semibold mb-3 text-green-300 flex items-center gap-2">
                <span>🎯</span>
                <span>Confidence Score</span>
              </h4>
              <div className="flex items-center gap-4">
                <div className="flex-1 bg-white/10 rounded-full h-4 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.confidenceScore || 0}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-400"
                  />
                </div>
                <span className="font-bold text-2xl">{result.confidenceScore || 0}%</span>
              </div>
            </motion.div>

            {/* Why This Career */}
            {result.whyThisCareer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 border border-white/20 rounded-xl p-6"
              >
                <h4 className="font-semibold mb-2 text-yellow-300 flex items-center gap-2">
                  <span>💡</span>
                  <span>Why This Career?</span>
                </h4>
                <p className="text-gray-200">{result.whyThisCareer}</p>
              </motion.div>
            )}

            {/* Priority Skills */}
            {result.prioritySkills && result.prioritySkills.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/10 border border-white/20 rounded-xl p-6"
              >
                <h4 className="font-semibold mb-4 text-blue-300 flex items-center gap-2">
                  <span>📚</span>
                  <span>Priority Skills to Learn</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {result.prioritySkills.map((skill, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + idx * 0.05 }}
                      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30 rounded-lg px-4 py-3 text-center font-medium"
                    >
                      {skill}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Short-term Steps */}
            {result.shortTermSteps && result.shortTermSteps.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/10 border border-white/20 rounded-xl p-6"
              >
                <h4 className="font-semibold mb-4 text-orange-300 flex items-center gap-2">
                  <span>⚡</span>
                  <span>Short-term Action Plan</span>
                </h4>
                <ol className="space-y-3">
                  {result.shortTermSteps.map((step, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      className="flex gap-3 items-start"
                    >
                      <span className="font-bold text-lg text-purple-300 bg-white/10 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-200 pt-1">{step}</span>
                    </motion.li>
                  ))}
                </ol>
              </motion.div>
            )}

            {/* Learning Roadmap */}
            {result.learningRoadmap && result.learningRoadmap.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-xl p-6"
              >
                <h4 className="font-semibold mb-4 text-green-300 flex items-center gap-2">
                  <span>🗺️</span>
                  <span>6-Month Learning Roadmap</span>
                </h4>
                <div className="space-y-4">
                  {result.learningRoadmap.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 + idx * 0.1 }}
                      className="bg-white/10 rounded-lg p-4"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-green-500 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-lg">Month {idx + 1}</span>
                      </div>
                      <p className="text-gray-200 ml-13">{typeof item === 'string' ? item : item.description || JSON.stringify(item)}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={downloadPDFReport}
                className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
              >
                <span>📄</span>
                <span>Download PDF Report</span>
              </button>
              <button
                onClick={onComplete}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 font-bold py-3 rounded-lg transition-all"
              >
                Continue to Next Step →
              </button>
            </div>

            <button
              onClick={() => {
                setCurrentStep(1);
                setResult(null);
                setError(null);
              }}
              className="w-full bg-white/10 hover:bg-white/20 font-semibold py-3 rounded-lg transition-all"
            >
              🔄 Start New Assessment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CareerGuidanceStep;
