import React, { useState } from 'react';
import Navbar from '../../components/common/Navbar.jsx';
import { useCareer } from '../../context/CareerContext.jsx';
import { motion } from 'framer-motion';
import { generateCareerGuidance } from '../../api/careerGuidanceApi.js';

const CareerGuidancePage = () => {
  const { setSelectedCareer, setCareerAnalysis, setConfidence } = useCareer();

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cgpa: 7.0,
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

  // Handlers
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

  // Helper: Format Interest Label
  const formatLabel = (label) => label.replace('_Interest', '').replace('_', ' ');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // transform data for backend prompt
      const apiPayload = {
        skills: Object.entries(formData.skills)
          .filter(([_, score]) => score > 0)
          .map(([skill, score]) => `${skill} (Level: ${score}/5)`),
        interests: Object.entries(formData.interests)
          .filter(([_, score]) => score > 30)
          .map(([interest, _]) => formatLabel(interest)),
        academics: `CGPA: ${formData.cgpa}`,
        goals: "Looking for a role in technology",
        experience: "Fresher" // Default for students
      };

      // Use the API helper which handles auth and correct endpoint
      const response = await generateCareerGuidance(apiPayload);

      if (response.data && response.data.success) {
        const resultData = response.data.data;

        // Normalize backend response to UI format (Adapting single result to array structure)
        const normalizedResults = {
          topCareers: [{
            career: resultData.recommendedCareer,
            confidence: resultData.confidenceScore
          }],
          readinessScore: resultData.readiness_score || resultData.readinessScore || resultData.confidenceScore, // prioritize explicit readiness score
          academicScore: 85, // Placeholder
          skillsScore: 90, // Placeholder
          interestScore: 95, // Placeholder
          analysis: resultData
        };

        setResults(normalizedResults);

        if (resultData.recommendedCareer) {
          setSelectedCareer(resultData.recommendedCareer);
          setConfidence(resultData.confidenceScore);
          setCareerAnalysis(resultData);
        }
      } else {
        throw new Error(response.data?.error || 'Analysis failed');
      }

    } catch (error) {
      console.error('Error:', error);
      const msg = error.response?.data?.error || error.message || 'Failed to generate career path.';
      alert(`Error: ${msg}. Please ensure you are logged in.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 pt-24 pb-20">

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            AI Career Guidance
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Complete the assessment below to receive a personalized career recommendation based on your skills, interests, and academic profile.
          </p>
        </div>

        {!results ? (
          /* ASSESSMENT FORM */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-10">

              {/* Personal Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">Technical Skills (0-5)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.entries(formData.skills).map(([skill, value]) => (
                    <div key={skill} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-300">{skill}</label>
                        <span className="text-sm font-bold text-indigo-400">{value}</span>
                      </div>
                      <input
                        type="range" min="0" max="5"
                        value={value}
                        onChange={(e) => handleSkillChange(skill, e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Interests Section */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">Interests (0-100)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(formData.interests).map(([interest, value]) => (
                    <div key={interest} className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                      <div className="flex justify-between mb-2">
                        <label className="text-sm font-medium text-slate-300">{formatLabel(interest)}</label>
                        <span className="text-sm font-bold text-indigo-400">{value}%</span>
                      </div>
                      <input
                        type="range" min="0" max="100"
                        value={value}
                        onChange={(e) => handleInterestChange(interest, e.target.value)}
                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* CGPA */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-6 border-b border-slate-700 pb-2">Academics</h3>
                <div className="max-w-md">
                  <label className="block text-sm font-medium text-slate-300 mb-2">CGPA (0-10)</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range" min="0" max="10" step="0.1"
                      value={formData.cgpa}
                      onChange={e => setFormData({ ...formData, cgpa: parseFloat(e.target.value) })}
                      className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                    <span className="text-lg font-bold text-white w-12 text-center">{formData.cgpa}</span>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Analyzing...'
                  ) : (
                    <>
                      <span>Generate Career Path</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    </>
                  )}
                </button>
              </div>

            </form>
          </motion.div>
        ) : (
          /* RESULTS DISPLAY */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Main Result Card */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-8 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-64 h-64 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.5l-2.5 1.25L12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z" /></svg>
              </div>

              <h2 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Recommended Career</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {results.topCareers?.[0]?.career}
              </h3>

              <div className="flex flex-wrap gap-4 mb-8">
                <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="block text-xs text-slate-400 mb-1">Fit Confidence</span>
                  <span className="text-xl font-bold text-green-400">{results.topCareers?.[0]?.confidence}%</span>
                </div>
                <div className="bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700">
                  <span className="block text-xs text-slate-400 mb-1">Readiness Score</span>
                  <span className="text-xl font-bold text-blue-400">{results.readinessScore}/100</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                {/* Why it fits */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3">Why this fits you</h4>
                  {results.analysis.whyThisCareer ? (
                    <div className="text-slate-300 space-y-3">
                      {results.analysis.whyThisCareer.split('\n').map((line, idx) => {
                        const trimmed = line.trim();
                        if (!trimmed) return null;

                        // Headings (e.g. "Top 3 Strengths:")
                        if (trimmed.endsWith(':') || /^\d+\./.test(trimmed) && trimmed.length < 50 && !trimmed.includes(' ')) {
                          return <h5 key={idx} className="font-bold text-indigo-300 mt-3 mb-1">{trimmed.replace(/^[-*]\s*/, '')}</h5>;
                        }

                        // Bullet points
                        if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
                          return (
                            <div key={idx} className="flex items-start gap-2">
                              <span className="text-green-500 mt-1.5 text-xs">●</span>
                              <span>{trimmed.replace(/^[-*•\d.]+\s*/, '')}</span>
                            </div>
                          );
                        }

                        // Normal text
                        return <p key={idx} className="text-sm">{trimmed}</p>;
                      })}
                    </div>
                  ) : (
                    <ul className="space-y-2">
                      {/* Fallback generic points */}
                      <li className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-500 mt-1">✔</span>
                        <span>Matches your high interest in {formatLabel(Object.keys(formData.interests).reduce((a, b) => formData.interests[a] > formData.interests[b] ? a : b))}</span>
                      </li>
                      <li className="flex items-start gap-2 text-slate-300">
                        <span className="text-green-500 mt-1">✔</span>
                        <span>Aligned with your technical skills profile</span>
                      </li>
                    </ul>
                  )}
                </div>
              </div>
            </div>

            {/* Alternative Careers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Alternative Career Options</h3>
                <div className="space-y-4">
                  {results.topCareers?.slice(1, 4).map((career, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg border border-slate-700/50 hover:border-slate-600 transition">
                      <span className="text-slate-200 font-medium">{career.career}</span>
                      <span className="text-sm text-slate-400">{career.confidence}% Match</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Recommended Next Steps</h3>
                <div className="space-y-3">
                  <a href="/career/roadmap" className="block text-center w-full py-3 bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 rounded-lg hover:bg-indigo-600/30 transition">
                    View Learning Roadmap
                  </a>
                  <a href="/career/resume" className="block text-center w-full py-3 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-lg hover:bg-slate-700 transition">
                    Analyze Resume
                  </a>
                </div>
              </div>
            </div>

            <div className="text-center pt-8">
              <button
                onClick={() => setResults(null)}
                className="text-slate-500 hover:text-white transition underline"
              >
                Retake Assessment
              </button>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default CareerGuidancePage;
