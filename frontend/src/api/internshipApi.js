import client from './axiosClient.js';

export const fetchInternships = (params = {}) =>
  client.get('/internships', { params });

export const fetchInternship = (id) => client.get(`/internships/${id}`);

export const applyInternship = (id, payload) =>
  client.post(`/internships/${id}/apply`, payload);