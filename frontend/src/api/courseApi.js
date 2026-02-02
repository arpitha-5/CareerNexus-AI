import client from './axiosClient.js';

export const getCourses = (params) => client.get('/courses', { params });
export const getCourse = (id) => client.get(`/courses/${id}`);
export const createCourse = (data) => client.post('/courses', data);
export const updateCourse = (id, data) => client.put(`/courses/${id}`, data);
export const enrollCourse = (id) => client.post(`/courses/${id}/enroll`);
export const submitQuiz = (id, answers, difficulty) =>
  client.post(`/courses/${id}/quiz/submit`, { answers, difficulty });

