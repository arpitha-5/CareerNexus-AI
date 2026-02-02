import client from './axiosClient.js';

export const getFacultyOverview = () => client.get('/faculty/overview');
export const getCourseStudents = (courseId) => client.get(`/faculty/courses/${courseId}/students`);
export const createAnnouncement = (data) => client.post('/faculty/announcements', data);

