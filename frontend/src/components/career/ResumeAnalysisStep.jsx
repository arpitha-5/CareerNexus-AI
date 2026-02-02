import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { analyzeResumeFile, downloadResumeReport } from '../../api/careerGuidanceApi.js';
import jsPDF from 'jspdf';

const ResumeAnalysisStep = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        setError('Please upload a PDF file only');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      setSelectedFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('Please select a PDF resume file');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await analyzeResumeFile(selectedFile);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Failed to analyze resume');
      console.error('Analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result) return;

    // Create PDF
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPos = margin;

    // Helper function to add text with word wrap
    const addText = (text, x, y, fontSize = 10, isBold = false) => {
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', isBold ? 'bold' : 'normal');
      return doc.text(text, x, y, { maxWidth: pageWidth - 2 * margin });
    };

    // Helper to check if we need a new page
    const checkNewPage = (neededSpace = 20) => {
      if (yPos + neededSpace > pageHeight - margin) {
        doc.addPage();
        yPos = margin;
        return true;
      }
      return false;
    };

    // Title
    doc.setFillColor(59, 130, 246); // Blue background
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('Resume Analysis Report', pageWidth / 2, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text('CareerNexus AI', pageWidth / 2, 30, { align: 'center' });
    
    yPos = 50;
    doc.setTextColor(0, 0, 0);

    // Analysis ID and Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Analysis ID: ${result.analysis_id}`, margin, yPos);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - margin - 60, yPos);
    yPos += 15;

    // Resume Score Section
    checkNewPage(40);
    doc.setFillColor(240, 240, 240);
    doc.rect(margin, yPos - 5, pageWidth - 2 * margin, 30, 'F');
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Resume Score', margin + 5, yPos + 5);
    doc.setFontSize(32);
    const scoreColor = result.overall_score >= 70 ? [34, 197, 94] : 
                       result.overall_score >= 40 ? [234, 179, 8] : [239, 68, 68];
    doc.setTextColor(...scoreColor);
    doc.text(`${result.overall_score}/100`, pageWidth - margin - 40, yPos + 15);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(result.ats_status, margin + 5, yPos + 20);
    yPos += 40;

    // Score Breakdown
    checkNewPage(60);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('📊 Score Breakdown', margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (result.breakdown) {
      Object.entries(result.breakdown).forEach(([key, data]) => {
        checkNewPage();
        const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        doc.text(`${label}: ${data.score}% (Weight: ${data.weight}%)`, margin + 5, yPos);
        yPos += 7;
      });
    }
    yPos += 5;

    // Career Match
    checkNewPage(50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('🎯 Career Match', margin, yPos);
    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Primary Role: ${result.primary_career?.role || 'N/A'}`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Match: ${result.primary_career?.match_percentage || 0}%`, margin + 5, yPos);
    yPos += 7;
    doc.text(`Confidence: ${result.primary_career?.confidence || 'N/A'}`, margin + 5, yPos);
    yPos += 10;

    if (result.alternate_roles && result.alternate_roles.length > 0) {
      doc.text(`Alternate Roles: ${result.alternate_roles.join(', ')}`, margin + 5, yPos, { maxWidth: pageWidth - 2 * margin });
      yPos += 10;
    }

    // Skills Found
    checkNewPage(50);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`💼 Skills Found (${result.skills_count || 0})`, margin, yPos);
    yPos += 10;
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    if (result.skills && result.skills.length > 0) {
      const skillsText = result.skills.join(', ');
      const splitSkills = doc.splitTextToSize(skillsText, pageWidth - 2 * margin - 10);
      splitSkills.forEach(line => {
        checkNewPage();
        doc.text(line, margin + 5, yPos);
        yPos += 5;
      });
    }
    yPos += 5;

    // Skills to Learn
    if (result.skill_gap?.missing_critical && result.skill_gap.missing_critical.length > 0) {
      checkNewPage(50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('⚠️ Skills to Learn', margin, yPos);
      yPos += 10;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const missingSkills = result.skill_gap.missing_critical.join(', ');
      const splitMissing = doc.splitTextToSize(missingSkills, pageWidth - 2 * margin - 10);
      splitMissing.forEach(line => {
        checkNewPage();
        doc.text(line, margin + 5, yPos);
        yPos += 5;
      });
      yPos += 5;
    }

    // Improvement Tips
    if (result.improvement_suggestions && result.improvement_suggestions.length > 0) {
      checkNewPage(60);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('💡 Improvement Suggestions', margin, yPos);
      yPos += 10;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      result.improvement_suggestions.forEach((tip, idx) => {
        checkNewPage(15);
        const tipText = `${idx + 1}. ${tip}`;
        const splitTip = doc.splitTextToSize(tipText, pageWidth - 2 * margin - 10);
        splitTip.forEach(line => {
          checkNewPage();
          doc.text(line, margin + 5, yPos);
          yPos += 6;
        });
        yPos += 2;
      });
    }

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Generated by CareerNexus AI - Your Career Guidance Platform', pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Save PDF
    const fileName = `Resume_Analysis_${result.analysis_id}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
  };

  const handleReset = () => {
    setResult(null);
    setSelectedFile(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 40) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Upload Section */}
            <div 
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors cursor-pointer bg-gray-50"
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="flex flex-col items-center space-y-2">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                {selectedFile ? (
                  <div>
                    <p className="font-semibold text-gray-800">✓ {selectedFile.name}</p>
                    <p className="text-sm text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold text-gray-800">Click to upload PDF</p>
                    <p className="text-sm text-gray-500">Max 5MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {loading && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <p className="text-blue-800 font-medium">Analyzing your resume...</p>
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={!selectedFile || loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-all"
            >
              {loading ? '🔄 Analyzing...' : '🚀 Analyze Resume'}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="results"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Score Header */}
            <div className={`border-2 rounded-lg p-4 ${getScoreColor(result.overall_score)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-80">Resume Score</p>
                  <p className="text-4xl font-bold">{result.overall_score}/100</p>
                  <p className="text-sm font-semibold mt-1">{result.ats_status}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs opacity-70">Analysis ID</p>
                  <p className="text-sm font-mono">{result.analysis_id}</p>
                </div>
              </div>
            </div>

            {/* Score Breakdown */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">📊 Score Breakdown</h3>
              <div className="space-y-2">
                {result.breakdown && Object.entries(result.breakdown).map(([key, data]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">{key.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${data.score}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-gray-800 w-12 text-right">{data.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Career Match */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">🎯 Career Match</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-800">{result.primary_career?.role}</span>
                  <span className="text-green-600 font-bold">{result.primary_career?.match_percentage}%</span>
                </div>
                {result.alternate_roles && result.alternate_roles.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Alternate Roles:</p>
                    <div className="flex flex-wrap gap-1">
                      {result.alternate_roles.map((role, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Skills */}
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-3">💼 Skills Found ({result.skills_count})</h3>
              <div className="flex flex-wrap gap-1">
                {result.skills?.slice(0, 15).map((skill, idx) => (
                  <span key={idx} className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
                {result.skills?.length > 15 && (
                  <span className="text-gray-500 text-xs px-2 py-1">+{result.skills.length - 15} more</span>
                )}
              </div>
            </div>

            {/* Skill Gap */}
            {result.skill_gap && result.skill_gap.missing_critical?.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-3">⚠️ Skills to Learn</h3>
                <div className="flex flex-wrap gap-1">
                  {result.skill_gap.missing_critical.slice(0, 10).map((skill, idx) => (
                    <span key={idx} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Improvement Tips */}
            {result.improvement_suggestions?.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-bold text-gray-800 mb-2">💡 Tips</h3>
                <ul className="space-y-1">
                  {result.improvement_suggestions.slice(0, 3).map((tip, idx) => (
                    <li key={idx} className="text-sm text-gray-700">
                      {idx + 1}. {tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleDownloadReport}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all"
              >
                📄 Download Report
              </button>
              <button
                onClick={handleReset}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition-all"
              >
                🔄 Analyze Another
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResumeAnalysisStep;
