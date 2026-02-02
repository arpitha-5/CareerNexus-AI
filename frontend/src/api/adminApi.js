import client from './axiosClient.js';

export const getAdminOverview = () => client.get('/admin/overview');
export const listUsers = (params) => client.get('/admin/users', { params });
export const updateUser = (id, data) => client.put(`/admin/users/${id}`, data);
export const getPendingCourses = () => client.get('/admin/courses/pending');
export const approveCourse = (id) => client.put(`/admin/courses/${id}/approve`);
export const getPendingInternships = () => client.get('/admin/internships/pending');
export const approveInternship = (id) => client.put(`/admin/internships/${id}/approve`);
export const getForumModeration = () => client.get('/admin/forum/moderate');
export const deleteForumPost = (id) => client.delete(`/admin/forum/posts/${id}`);

