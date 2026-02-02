import client from './axiosClient.js';

const API_BASE = 'http://localhost:5000/api/users';

// Photo endpoints
export const uploadProfilePhoto = (formData) =>
  client.post('/users/upload-photo', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const deleteProfilePhoto = () =>
  client.delete('/users/profile-photo');

// Legacy endpoints
export const updateProfile = (profileData) =>
  client.put('/users/profile', profileData);

export const getUserProfile = () =>
  client.get('/users/profile');

// ===== NEW PROFILE MANAGEMENT ENDPOINTS =====

// Get complete profile with all sections
export const getFullProfile = () =>
  client.get('/profile');

// Update basic profile info
export const updateBasicProfile = (data) =>
  client.put('/profile', data);

// Update education details
export const updateEducation = (educationData) =>
  client.put('/profile/education', educationData);

// Update skills
export const updateSkills = (skillsData) =>
  client.put('/profile/skills', skillsData);

// Update certifications
export const updateCertifications = (certificationsData) =>
  client.put('/profile/certifications', certificationsData);

// Update internships
export const updateInternships = (internshipsData) =>
  client.put('/profile/internships', internshipsData);

// Update social links
export const updateSocials = (socialsData) =>
  client.put('/profile/socials', socialsData);

// Get career analytics
export const getProfileAnalytics = () =>
  client.get('/profile/analytics');

