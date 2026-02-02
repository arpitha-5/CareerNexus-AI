import client from './axiosClient.js';

// Career Guidance Journey APIs

export const generateCareerGuidance = (profileData) =>
  client.post('/career/career-guidance', profileData);

export const analyzeResume = (resumeText) =>
  client.post('/career/resume-analysis', { resumeText });

export const generateInterviewPrep = () =>
  client.post('/career/interview-prep');

export const generateLearningRoadmap = () =>
  client.post('/career/learning-roadmap');

export const generateCareerReport = () =>
  client.post('/career/career-report');

export const getCareerGuidanceStatus = () =>
  client.get('/career/status');

// Resume Analyzer APIs (Node.js backend with Mistral AI)
const BACKEND_BASE_URL = 'http://localhost:5001';

export const analyzeResumeFile = async (file) => {
  const formData = new FormData();
  formData.append('resume', file);
  
  const response = await fetch(`${BACKEND_BASE_URL}/api/resume/analyze`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to analyze resume');
  }
  
  return response.json();
};

export const downloadResumeReport = (analysisId) => {
  // Direct link to get report data as JSON
  return `${BACKEND_BASE_URL}/api/resume/report/${analysisId}`;
};
