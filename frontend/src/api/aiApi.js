import client from './axiosClient.js';

export const uploadResume = (formData) =>
  client.post('/ai/upload-resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchParsedResume = () => client.post('/ai/analyze-resume');
export const generateSkillGaps = (targetRole) =>
  client.post('/ai/generate-skill-gaps', { targetRole });
export const generateLearningPlan = () => client.post('/ai/generate-learning-plan');
export const getLearningPlan = () => client.get('/ai/learning-plan');
export const generateCareerRoadmap = (targetRole) =>
  client.post('/ai/generate-career-roadmap', { targetRole });
export const getCareerRoadmap = () => client.get('/ai/career-roadmap');
export const recalcAdaptivePlan = () => client.post('/ai/adaptive-engine-recalculate');
export const downloadCareerReport = () =>
  client.post('/ai/career/report', {}, { responseType: 'blob' });
export const chatbotMessage = (message) => client.post('/ai/chatbot', { message });
export const getCareerGuidance = () => client.post('/ai/career');
export const analyzeJobRoleMatch = (targetRole) => client.post('/ai/career/match-role', { targetRole });
export const analyzeCareerRisk = (targetRole) => client.post('/ai/career-risk', { targetRole });
