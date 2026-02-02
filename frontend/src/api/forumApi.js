import client from './axiosClient.js';

export const fetchPosts = () => client.get('/forum/posts');
export const getPost = (id) => client.get(`/forum/posts/${id}`);
export const createPost = (data) => client.post('/forum/posts', data);
export const addComment = (postId, content) => client.post(`/forum/posts/${postId}/comments`, { content });
export const likePost = (postId) => client.post(`/forum/posts/${postId}/like`);
